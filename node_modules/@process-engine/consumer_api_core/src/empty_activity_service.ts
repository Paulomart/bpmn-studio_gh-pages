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
import {FinishEmptyActivityMessage as InternalFinishEmptyActivityMessage} from '@process-engine/process_engine_contracts';

import {NotificationAdapter} from './adapters/index';
import {applyPagination} from './paginator';

const superAdminClaim = 'can_manage_process_instances';
const canSubscribeToEventsClaim = 'can_subscribe_to_events';

export class EmptyActivityService implements APIs.IEmptyActivityConsumerApi {

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

  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async getEmptyActivitiesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByProcessModel(processModelId);

    const emptyActivityList = await this.filterAndConvertEmptyActivityList(identity, suspendedFlowNodes, offset, limit);

    return emptyActivityList;
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const emptyActivityList = await this.filterAndConvertEmptyActivityList(identity, suspendedFlowNodes, offset, limit);

    return emptyActivityList;
  }

  public async getEmptyActivitiesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const emptyActivityList = await this.filterAndConvertEmptyActivityList(identity, suspendedFlowNodes, offset, limit);

    return emptyActivityList;
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {

    const flowNodeInstances = await this.flowNodeInstanceService.queryByCorrelationAndProcessModel(correlationId, processModelId);

    const suspendedFlowNodes = flowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      return flowNodeInstance.state === FlowNodeInstanceState.suspended;
    });

    const emptyActivityList = await this.filterAndConvertEmptyActivityList(identity, suspendedFlowNodes, offset, limit);

    return emptyActivityList;
  }

  public async getWaitingEmptyActivitiesByIdentity(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.queryByState(FlowNodeInstanceState.suspended);

    const flowNodeInstancesOwnedByUser = suspendedFlowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      const isEmptyActivity = this.checkIfIsFlowNodeIsEmptyActivity(flowNodeInstance);
      const userIdsMatch = this.checkIfIdentityUserIDsMatch(identity, flowNodeInstance.owner);
      return isEmptyActivity && userIdsMatch;
    });

    const emptyActivitiesToReturn = applyPagination(flowNodeInstancesOwnedByUser, offset, limit);

    const emptyActivityList = this.convertFlowNodeInstancesToEmptyActivities(emptyActivitiesToReturn);

    return emptyActivityList;
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {

    const matchingFlowNodeInstance =
      await this.getFlowNodeInstanceForCorrelationInProcessInstance(correlationId, processInstanceId, emptyActivityInstanceId);

    if (matchingFlowNodeInstance === undefined) {
      const errorMessage =
        // eslint-disable-next-line max-len
        `ProcessInstance '${processInstanceId}' in Correlation '${correlationId}' does not have an EmptyActivity with id '${emptyActivityInstanceId}'`;
      throw new EssentialProjectErrors.NotFoundError(errorMessage);
    }

    if (matchingFlowNodeInstance.flowNodeLane !== undefined) {
      await this.ensureHasClaim(identity, matchingFlowNodeInstance.flowNodeLane);
    }

    return new Promise<void>((resolve: Function): void => {
      const routePrameter: {[name: string]: string} = Messages.EventAggregatorSettings.messageParams;

      const emptyActivityFinishedEvent = Messages.EventAggregatorSettings
        .messagePaths.emptyActivityWithInstanceIdFinished
        .replace(routePrameter.correlationId, correlationId)
        .replace(routePrameter.processInstanceId, processInstanceId)
        .replace(routePrameter.flowNodeInstanceId, emptyActivityInstanceId);

      this.eventAggregator.subscribeOnce(emptyActivityFinishedEvent, (): void => {
        resolve();
      });

      this.publishFinishEmptyActivityEvent(identity, matchingFlowNodeInstance);
    });
  }

  public async filterAndConvertEmptyActivityList(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {

    const emptyActivities = suspendedFlowNodes.filter(this.checkIfIsFlowNodeIsEmptyActivity);

    const accessibleEmptyActivities = await this.filterInacessibleFlowNodeInstances(identity, emptyActivities);

    const emptyActivitiesToReturn = applyPagination(accessibleEmptyActivities, offset, limit);

    const emptyActivityList = this.convertFlowNodeInstancesToEmptyActivities(emptyActivitiesToReturn);

    return emptyActivityList;
  }

  private convertFlowNodeInstancesToEmptyActivities(suspendedFlowNodes: Array<FlowNodeInstance>): DataModels.EmptyActivities.EmptyActivityList {

    const suspendedEmptyActivities = suspendedFlowNodes.map(this.convertSuspendedFlowNodeToEmptyActivity);

    const emptyActivityList: DataModels.EmptyActivities.EmptyActivityList = {
      emptyActivities: suspendedEmptyActivities,
      totalCount: suspendedEmptyActivities.length,
    };

    return emptyActivityList;
  }

  private checkIfIsFlowNodeIsEmptyActivity(flowNodeInstance: FlowNodeInstance): boolean {
    return flowNodeInstance.flowNodeType === BpmnType.emptyActivity;
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

  private convertSuspendedFlowNodeToEmptyActivity(emptyActivityInstance: FlowNodeInstance): DataModels.EmptyActivities.EmptyActivity {

    const onSuspendToken = emptyActivityInstance.getTokenByType(ProcessTokenType.onSuspend);

    const consumerApiEmptyActivity: DataModels.EmptyActivities.EmptyActivity = {
      flowNodeType: BpmnType.emptyActivity,
      id: emptyActivityInstance.flowNodeId,
      flowNodeInstanceId: emptyActivityInstance.id,
      name: emptyActivityInstance.flowNodeName,
      correlationId: emptyActivityInstance.correlationId,
      processModelId: emptyActivityInstance.processModelId,
      processInstanceId: emptyActivityInstance.processInstanceId,
      tokenPayload: onSuspendToken.payload,
    };

    return consumerApiEmptyActivity;
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

  private publishFinishEmptyActivityEvent(
    identity: IIdentity,
    emptyActivityInstance: FlowNodeInstance,
  ): void {

    const currentToken = emptyActivityInstance.getTokenByType(ProcessTokenType.onSuspend);

    const finishEmptyActivityMessage = new InternalFinishEmptyActivityMessage(
      emptyActivityInstance.correlationId,
      emptyActivityInstance.processModelId,
      emptyActivityInstance.processInstanceId,
      emptyActivityInstance.id,
      emptyActivityInstance.id,
      identity,
      currentToken.payload,
    );

    const finishEmptyActivityEvent = Messages.EventAggregatorSettings.messagePaths.finishEmptyActivity
      .replace(Messages.EventAggregatorSettings.messageParams.correlationId, emptyActivityInstance.correlationId)
      .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, emptyActivityInstance.processInstanceId)
      .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, emptyActivityInstance.id);

    this.eventAggregator.publish(finishEmptyActivityEvent, finishEmptyActivityMessage);
  }

}
