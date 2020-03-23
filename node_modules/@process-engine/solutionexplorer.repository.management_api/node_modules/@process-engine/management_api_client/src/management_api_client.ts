import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels, IManagementApiAccessor, IManagementApiClient, Messages,
} from '@process-engine/management_api_contracts';

export class ManagementApiClient implements IManagementApiClient {

  private managementApiAccessor: IManagementApiAccessor = undefined;

  constructor(managementApiAccessor: IManagementApiAccessor) {
    this.managementApiAccessor = managementApiAccessor;
  }

  // Notifications
  public async onActivityReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onActivityReached(identity, callback, subscribeOnce);
  }

  public async onActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onBoundaryEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onIntermediateThrowEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onIntermediateCatchEventReached(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onIntermediateCatchEventFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessError(identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onCronjobExecuted(identity, callback, subscribeOnce);
  }

  public async onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onCronjobCreated(identity, callback, subscribeOnce);
  }

  public async onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onCronjobUpdated(identity, callback, subscribeOnce);
  }

  public async onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onCronjobStopped(identity, callback, subscribeOnce);
  }

  public async onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onCronjobRemoved(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.removeSubscription(identity, subscription);
  }

  // Correlations
  public async getAllCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getAllCorrelations(identity, offset, limit);
  }

  public async getActiveCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveCorrelations(identity, offset, limit);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCorrelationById(identity, correlationId);
  }

  public async getProcessInstanceById(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.ProcessInstance> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessInstanceById(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCorrelationsByProcessModelId(identity, processModelId, offset, limit);
  }

  public async getProcessInstancesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessInstancesForCorrelation(identity, correlationId, offset, limit);
  }

  public async getProcessInstancesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessInstancesForProcessModel(identity, processModelId, offset, limit);
  }

  public async getProcessInstancesByState(
    identity: IIdentity,
    state: DataModels.Correlations.CorrelationState,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessInstancesByState(identity, state, offset, limit);
  }

  // Cronjobs
  public async getAllActiveCronjobs(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getAllActiveCronjobs(identity, offset, limit);
  }

  public async getCronjobExecutionHistoryForProcessModel(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCronjobExecutionHistoryForProcessModel(identity, processModelId, startEventId, offset, limit);
  }

  public async getCronjobExecutionHistoryForCrontab(
    identity: IIdentity,
    crontab: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCronjobExecutionHistoryForCrontab(identity, crontab, offset, limit);
  }

  // ProcessModels
  public async getProcessModels(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ProcessModels.ProcessModelList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModels(identity, offset, limit);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModelById(identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModelByProcessInstanceId(identity, processInstanceId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload?: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    this.ensureIsAuthorized(identity);

    if (!Object.values(DataModels.ProcessModels.StartCallbackType).includes(startCallbackType)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackType} is not a valid return option!`);
    }

    if (startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached && !endEventId) {
      throw new EssentialProjectErrors.BadRequestError('Must provide an EndEventId, when using callback type \'CallbackOnEndEventReached\'!');
    }

    return this.managementApiAccessor.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.terminateProcessInstance(identity, processInstanceId);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForProcessModel(identity, processModelId, offset, limit);
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getEmptyActivitiesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForCorrelation(identity, correlationId, offset, limit);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // Events
  public async getWaitingEventsForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getWaitingEventsForProcessModel(identity, processModelId, offset, limit);
  }

  public async getWaitingEventsForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getWaitingEventsForCorrelation(identity, correlationId, offset, limit);
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.triggerSignalEvent(identity, signalName, payload);
  }

  // FlowNodeInstances
  public async getFlowNodeInstancesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.FlowNodeInstanceList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getFlowNodeInstancesForProcessInstance(identity, processInstanceId, offset, limit);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForProcessModel(identity, processModelId, offset, limit);
  }

  public async getManualTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getManualTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForCorrelation(identity, correlationId, offset, limit);
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // UserTasks
  public async getUserTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForProcessModel(identity, processModelId, offset, limit);
  }

  public async getUserTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getUserTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForCorrelation(identity, correlationId, offset, limit);
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // Tasks
  public async getAllSuspendedTasks(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getAllSuspendedTasks(identity, offset, limit);
  }

  public async getSuspendedTasksForProcessModel(
    identity: IIdentity, processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getSuspendedTasksForProcessModel(identity, processModelId, offset, limit);
  }

  public async getSuspendedTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getSuspendedTasksForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getSuspendedTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getSuspendedTasksForCorrelation(identity, correlationId, offset, limit);
  }

  public async getSuspendedTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getSuspendedTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformationList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getRuntimeInformationForProcessModel(identity, processModelId, offset, limit);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForProcessModel(identity, processModelId, offset, limit);
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId, offset, limit);
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getActiveTokensForFlowNode(
    identity: IIdentity,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForFlowNode(identity, flowNodeId, offset, limit);
  }

  public async getProcessModelLog(
    identity: IIdentity,
    processModelId: string,
    correlationId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModelLog(identity, processModelId, correlationId, offset, limit);
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessInstanceLog(identity, processModelId, processInstanceId, offset, limit);
  }

  public async getTokensForFlowNode(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.TokenHistory.TokenHistoryEntryList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId, offset, limit);
  }

  public async getTokensForFlowNodeByProcessInstanceId(
    identity: IIdentity,
    processInstanceId: string,
    flowNodeId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForProcessInstance(identity, processInstanceId);
  }

  private ensureIsAuthorized(identity: IIdentity): void {
    const authTokenNotProvided = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }

}
