import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';
import {APIs, DataModels, Messages} from '@process-engine/consumer_api_contracts';
import {
  BpmnType,
  FlowNodeInstance,
  FlowNodeInstanceState,
  IFlowNodeInstanceService,
  ProcessTokenType,
} from '@process-engine/persistence_api.contracts';
import {FinishManualTaskMessage as InternalFinishManualTaskMessage} from '@process-engine/process_engine_contracts';

import {NotificationAdapter} from './adapters/index';
import {applyPagination} from './paginator';

const superAdminClaim = 'can_manage_process_instances';
const canSubscribeToEventsClaim = 'can_subscribe_to_events';

export class ManualTaskService implements APIs.IManualTaskConsumerApi {

  private readonly eventAggregator: IEventAggregator;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;
  private readonly iamService: IIAMService;
  private readonly notificationAdapter: NotificationAdapter;

  constructor(
    eventAggregator: IEventAggregator,
    flowNodeInstanceService: IFlowNodeInstanceService,
    iamService: IIAMService,
    notificationAdapter: NotificationAdapter,
  ) {
    this.eventAggregator = eventAggregator;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.iamService = iamService;
    this.notificationAdapter = notificationAdapter;

  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async getManualTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByProcessModel(processModelId);

    const manualTaskList = await this.filterAndConvertManualTaskList(identity, suspendedFlowNodes, offset, limit);

    return manualTaskList;
  }

  public async getManualTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const manualTaskList = await this.filterAndConvertManualTaskList(identity, suspendedFlowNodes, offset, limit);

    return manualTaskList;
  }

  public async getManualTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const manualTaskList = await this.filterAndConvertManualTaskList(identity, suspendedFlowNodes, offset, limit);

    return manualTaskList;
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const flowNodeInstances = await this.flowNodeInstanceService.queryByCorrelationAndProcessModel(correlationId, processModelId);

    const suspendedFlowNodes = flowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      return flowNodeInstance.state === FlowNodeInstanceState.suspended;
    });

    const manualTaskList = await this.filterAndConvertManualTaskList(identity, suspendedFlowNodes, offset, limit);

    return manualTaskList;
  }

  public async getWaitingManualTasksByIdentity(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.queryByState(FlowNodeInstanceState.suspended);

    const flowNodeInstancesOwnedByUser = suspendedFlowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      const isManualTask = this.checkIfIsFlowNodeIsManualTask(flowNodeInstance);
      const userIdsMatch = this.checkIfIdentityUserIDsMatch(identity, flowNodeInstance.owner);
      return isManualTask && userIdsMatch;
    });

    const manualTasksToReturn = applyPagination(flowNodeInstancesOwnedByUser, offset, limit);

    const manualTaskList = this.convertFlowNodeInstancesToManualTasks(manualTasksToReturn);

    return manualTaskList;
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {

    const matchingFlowNodeInstance =
      await this.getFlowNodeInstanceForCorrelationInProcessInstance(correlationId, processInstanceId, manualTaskInstanceId);

    if (matchingFlowNodeInstance === undefined) {
      const errorMessage =
        `ProcessInstance '${processInstanceId}' in Correlation '${correlationId}' does not have a ManualTask with id '${manualTaskInstanceId}'`;
      throw new EssentialProjectErrors.NotFoundError(errorMessage);
    }

    if (matchingFlowNodeInstance.flowNodeLane !== undefined) {
      await this.ensureHasClaim(identity, matchingFlowNodeInstance.flowNodeLane);
    }

    return new Promise<void>((resolve: Function): void => {
      const routePrameter: {[name: string]: string} = Messages.EventAggregatorSettings.messageParams;

      const manualTaskFinishedEvent = Messages.EventAggregatorSettings
        .messagePaths.manualTaskWithInstanceIdFinished
        .replace(routePrameter.correlationId, correlationId)
        .replace(routePrameter.processInstanceId, processInstanceId)
        .replace(routePrameter.flowNodeInstanceId, manualTaskInstanceId);

      this.eventAggregator.subscribeOnce(manualTaskFinishedEvent, (): void => {
        resolve();
      });

      this.publishFinishManualTaskEvent(identity, matchingFlowNodeInstance);
    });
  }

  public async filterAndConvertManualTaskList(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const manualTasks = suspendedFlowNodes.filter(this.checkIfIsFlowNodeIsManualTask);

    const accessibleManualTasks = await this.filterInacessibleFlowNodeInstances(identity, manualTasks);

    const manualTasksToReturn = applyPagination(accessibleManualTasks, offset, limit);

    const manualTaskList = this.convertFlowNodeInstancesToManualTasks(manualTasksToReturn);

    return manualTaskList;
  }

  private convertFlowNodeInstancesToManualTasks(suspendedFlowNodes: Array<FlowNodeInstance>): DataModels.ManualTasks.ManualTaskList {

    const suspendedManualTasks = suspendedFlowNodes.map(this.convertSuspendedFlowNodeToManualTask);

    const manualTaskList: DataModels.ManualTasks.ManualTaskList = {
      manualTasks: suspendedManualTasks,
      totalCount: suspendedManualTasks.length,
    };

    return manualTaskList;
  }

  private checkIfIsFlowNodeIsManualTask(flowNodeInstance: FlowNodeInstance): boolean {
    return flowNodeInstance.flowNodeType === BpmnType.manualTask;
  }

  private checkIfIdentityUserIDsMatch(identityA: IIdentity, identityB: IIdentity): boolean {
    return identityA.userId === identityB.userId;
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

  private async ensureHasClaim(identity: IIdentity, claimName: string): Promise<void> {
    const isSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);

    if (isSuperAdmin) {
      return;
    }

    await this.iamService.ensureHasClaim(identity, claimName);
  }

  private async checkIfUserIsSuperAdmin(identity: IIdentity): Promise<boolean> {
    try {
      await this.iamService.ensureHasClaim(identity, superAdminClaim);

      return true;
    } catch (error) {
      return false;
    }
  }

  private convertSuspendedFlowNodeToManualTask(manualTaskInstance: FlowNodeInstance): DataModels.ManualTasks.ManualTask {

    const onSuspendToken = manualTaskInstance.getTokenByType(ProcessTokenType.onSuspend);

    const consumerApiManualTask: DataModels.ManualTasks.ManualTask = {
      flowNodeType: BpmnType.manualTask,
      id: manualTaskInstance.flowNodeId,
      flowNodeInstanceId: manualTaskInstance.id,
      name: manualTaskInstance.flowNodeName,
      correlationId: manualTaskInstance.correlationId,
      processModelId: manualTaskInstance.processModelId,
      processInstanceId: manualTaskInstance.processInstanceId,
      tokenPayload: onSuspendToken.payload,
    };

    return consumerApiManualTask;
  }

  private async getFlowNodeInstanceForCorrelationInProcessInstance(
    correlationId: string,
    processInstanceId: string,
    instanceId: string,
  ): Promise<FlowNodeInstance> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const matchingInstance = suspendedFlowNodeInstances.find((instance: FlowNodeInstance): boolean => {
      return instance.id === instanceId &&
             instance.correlationId === correlationId;
    });

    return matchingInstance;
  }

  private publishFinishManualTaskEvent(identity: IIdentity, manualTaskInstance: FlowNodeInstance): void {

    // ManualTasks do not produce results.
    const emptyPayload = {};
    const finishManualTaskMessage = new InternalFinishManualTaskMessage(
      manualTaskInstance.correlationId,
      manualTaskInstance.processModelId,
      manualTaskInstance.processInstanceId,
      manualTaskInstance.id,
      manualTaskInstance.id,
      identity,
      emptyPayload,
    );

    const finishManualTaskEvent = Messages.EventAggregatorSettings.messagePaths.finishManualTask
      .replace(Messages.EventAggregatorSettings.messageParams.correlationId, manualTaskInstance.correlationId)
      .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, manualTaskInstance.processInstanceId)
      .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, manualTaskInstance.id);

    this.eventAggregator.publish(finishManualTaskEvent, finishManualTaskMessage);
  }

}
