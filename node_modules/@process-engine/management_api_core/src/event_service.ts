/* eslint-disable @typescript-eslint/no-explicit-any */
import {InternalServerError} from '@essential-projects/errors_ts';
import {IEventAggregator} from '@essential-projects/event_aggregator_contracts';
import {IIAMService, IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {APIs, DataModels, Messages} from '@process-engine/management_api_contracts';
import {
  FlowNodeInstance,
  FlowNodeInstanceState,
  ICorrelationService,
  IFlowNodeInstanceService,
  IProcessModelUseCases,
  Model,
} from '@process-engine/persistence_api.contracts';
import {IProcessModelFacade, IProcessModelFacadeFactory} from '@process-engine/process_engine_contracts';

import {applyPagination} from './paginator';
import * as ProcessModelCache from './process_model_cache';

const superAdminClaim = 'can_manage_process_instances';
const canTriggerMessagesClaim = 'can_trigger_messages';
const canTriggerSignalsClaim = 'can_trigger_signals';

export class EventService implements APIs.IEventManagementApi {

  private readonly correlationService: ICorrelationService;
  private readonly eventAggregator: IEventAggregator;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;
  private readonly identityService: IIdentityService;
  private readonly iamService: IIAMService;
  private readonly processModelUseCase: IProcessModelUseCases;
  private readonly processModelFacadeFactory: IProcessModelFacadeFactory;

  // This identity is used to ensure that this service can work with full ProcessModels.
  // It needs those in order to be able to read an Event's config.
  private internalIdentity: IIdentity;

  constructor(
    correlationService: ICorrelationService,
    eventAggregator: IEventAggregator,
    flowNodeInstanceService: IFlowNodeInstanceService,
    identityService: IIdentityService,
    iamService: IIAMService,
    processModelFacadeFactory: IProcessModelFacadeFactory,
    processModelUseCase: IProcessModelUseCases,
  ) {
    this.correlationService = correlationService;
    this.eventAggregator = eventAggregator;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.identityService = identityService;
    this.iamService = iamService;
    this.processModelFacadeFactory = processModelFacadeFactory;
    this.processModelUseCase = processModelUseCase;
  }

  public async initialize(): Promise<void> {
    const internalToken = 'UHJvY2Vzc0VuZ2luZUludGVybmFsVXNlcg==';
    this.internalIdentity = await this.identityService.getIdentity(internalToken);
  }

  public async getWaitingEventsForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByProcessModel(processModelId);

    const eventList = await this.filterAndConvertEventList(identity, suspendedFlowNodeInstances, offset, limit);

    return eventList;
  }

  public async getWaitingEventsForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const eventList = await this.filterAndConvertEventList(identity, suspendedFlowNodeInstances, offset, limit);

    return eventList;
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    const flowNodeInstances = await this.flowNodeInstanceService.queryByCorrelationAndProcessModel(correlationId, processModelId);

    const suspendedFlowNodeInstances = flowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      return flowNodeInstance.state === FlowNodeInstanceState.suspended;
    });

    const eventList = await this.filterAndConvertEventList(identity, suspendedFlowNodeInstances, offset, limit);

    return eventList;
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    await this.iamService.ensureHasClaim(identity, canTriggerMessagesClaim);

    const messageEventName = Messages.EventAggregatorSettings.messagePaths.messageEventReached
      .replace(Messages.EventAggregatorSettings.messageParams.messageReference, messageName);

    this.eventAggregator.publish(messageEventName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    await this.iamService.ensureHasClaim(identity, canTriggerSignalsClaim);

    const signalEventName = Messages.EventAggregatorSettings.messagePaths.signalEventReached
      .replace(Messages.EventAggregatorSettings.messageParams.signalReference, signalName);

    this.eventAggregator.publish(signalEventName, payload);
  }

  public async filterAndConvertEventList(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Events.EventList> {

    const events = suspendedFlowNodes.filter(this.checkIfFlowNodeIsAnEvent);

    const accessibleEvents = await this.filterInacessibleFlowNodeInstances(identity, events);

    const eventsToReturn = applyPagination(accessibleEvents, offset, limit);

    const eventList = await this.convertFlowNodeInstancesToEvents(identity, eventsToReturn);

    return eventList;
  }

  private checkIfFlowNodeIsAnEvent(flowNodeInstance: FlowNodeInstance): boolean {
    return flowNodeInstance.eventType !== undefined;
  }

  private async filterInacessibleFlowNodeInstances(
    identity: IIdentity,
    flowNodeInstances: Array<FlowNodeInstance>,
  ): Promise<Array<FlowNodeInstance>> {
    const isSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);

    if (isSuperAdmin) {
      return flowNodeInstances;
    }

    const accessibleFlowNodeInstances = Promise.filter(flowNodeInstances, async (item: FlowNodeInstance): Promise<boolean> => {
      return this.checkIfUserCanAccessFlowNodeInstance(identity, item);
    });

    return accessibleFlowNodeInstances;
  }

  private async checkIfUserCanAccessFlowNodeInstance(identity: IIdentity, flowNodeInstance: FlowNodeInstance): Promise<boolean> {
    try {
      if (!flowNodeInstance.flowNodeLane) {
        return true;
      }

      await this.iamService.ensureHasClaim(identity, flowNodeInstance.flowNodeLane);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async checkIfUserIsSuperAdmin(identity: IIdentity): Promise<boolean> {
    try {
      await this.iamService.ensureHasClaim(identity, superAdminClaim);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async convertFlowNodeInstancesToEvents(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
  ): Promise<DataModels.Events.EventList> {

    const suspendedEvents =
      await Promise.map(suspendedFlowNodes, async (flowNode): Promise<DataModels.Events.Event> => {
        return this.convertToManagementApiEvent(identity, flowNode);
      });

    const eventList: DataModels.Events.EventList = {
      events: suspendedEvents,
      totalCount: suspendedEvents.length,
    };

    return eventList;
  }

  private async convertToManagementApiEvent(identity: IIdentity, suspendedFlowNode: FlowNodeInstance): Promise<DataModels.Events.Event> {

    const processModelFacade = await this.getProcessModelForFlowNodeInstance(identity, suspendedFlowNode);
    const flowNodeModel = processModelFacade.getFlowNodeById(suspendedFlowNode.flowNodeId);

    const managementApiEvent: DataModels.Events.Event = {
      id: suspendedFlowNode.flowNodeId,
      flowNodeInstanceId: suspendedFlowNode.id,
      correlationId: suspendedFlowNode.correlationId,
      processModelId: suspendedFlowNode.processModelId,
      processInstanceId: suspendedFlowNode.processInstanceId,
      eventType: <DataModels.Events.EventType> suspendedFlowNode.eventType,
      eventName: this.getEventDefinitionFromFlowNodeModel(flowNodeModel, suspendedFlowNode.eventType),
      bpmnType: suspendedFlowNode.flowNodeType,
    };

    return managementApiEvent;
  }

  private async getProcessModelForFlowNodeInstance(
    identity: IIdentity,
    flowNodeInstance: FlowNodeInstance,
  ): Promise<IProcessModelFacade> {

    let processModel: Model.Process;

    // We must store the ProcessModel for each user, to account for lane-restrictions.
    // Some users may not be able to see some lanes that are visible to others.
    const cacheKeyToUse = `${flowNodeInstance.processInstanceId}-${identity.token}`;

    const cacheHasMatchingEntry = ProcessModelCache.hasEntry(cacheKeyToUse);
    if (cacheHasMatchingEntry) {
      processModel = ProcessModelCache.get(cacheKeyToUse);
    } else {
      const processModelHash = await this.getProcessModelHashForProcessInstance(identity, flowNodeInstance.processInstanceId);
      processModel = await this.processModelUseCase.getByHash(identity, flowNodeInstance.processModelId, processModelHash);
      ProcessModelCache.add(cacheKeyToUse, processModel);
    }

    const processModelFacade = this.processModelFacadeFactory.create(processModel);

    return processModelFacade;
  }

  private async getProcessModelHashForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<string> {
    const processInstance = await this.correlationService.getByProcessInstanceId(this.internalIdentity, processInstanceId);

    return processInstance.hash;
  }

  private getEventDefinitionFromFlowNodeModel(flowNodeModel: Model.Events.Event, eventType: string): string {

    switch (eventType) {
      case DataModels.Events.EventType.messageEvent:
        return (flowNodeModel as any).messageEventDefinition.name;
      case DataModels.Events.EventType.signalEvent:
        return (flowNodeModel as any).signalEventDefinition.name;
      default:
        throw new InternalServerError(`${flowNodeModel.id} is not a triggerable event!`);
    }
  }

}
