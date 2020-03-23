import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  APIs, DataModels, IManagementApiAccessor, Messages,
} from '@process-engine/management_api_contracts';

export class InternalAccessor implements IManagementApiAccessor {

  private correlationService: APIs.ICorrelationManagementApi;
  private cronjobService: APIs.ICronjobManagementApi;
  private emptyActivityService: APIs.IEmptyActivityManagementApi;
  private eventService: APIs.IEventManagementApi;
  private flowNodeInstanceService: APIs.IFlowNodeInstanceManagementApi;
  private kpiService: APIs.IKpiManagementApi;
  private loggingService: APIs.ILoggingManagementApi;
  private manualTaskService: APIs.IManualTaskManagementApi;
  private notificationService: APIs.INotificationManagementApi;
  private processModelService: APIs.IProcessModelManagementApi;
  private tokenHistoryService: APIs.ITokenHistoryManagementApi;
  private userTaskService: APIs.IUserTaskManagementApi;

  constructor(
    correlationService: APIs.ICorrelationManagementApi,
    cronjobService: APIs.ICronjobManagementApi,
    emptyActivityService: APIs.IEmptyActivityManagementApi,
    eventService: APIs.IEventManagementApi,
    flowNodeInstanceService: APIs.IFlowNodeInstanceManagementApi,
    kpiService: APIs.IKpiManagementApi,
    loggingService: APIs.ILoggingManagementApi,
    manualTaskService: APIs.IManualTaskManagementApi,
    notificationService: APIs.INotificationManagementApi,
    processModelService: APIs.IProcessModelManagementApi,
    tokenHistoryService: APIs.ITokenHistoryManagementApi,
    userTaskService: APIs.IUserTaskManagementApi,
  ) {
    this.correlationService = correlationService;
    this.cronjobService = cronjobService;
    this.emptyActivityService = emptyActivityService;
    this.eventService = eventService;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.kpiService = kpiService;
    this.loggingService = loggingService;
    this.manualTaskService = manualTaskService;
    this.notificationService = notificationService;
    this.processModelService = processModelService;
    this.tokenHistoryService = tokenHistoryService;
    this.userTaskService = userTaskService;
  }

  // Notifications
  public async onActivityReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onActivityReached(identity, callback, subscribeOnce);
  }

  public async onActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onBoundaryEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onIntermediateThrowEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onIntermediateCatchEventReached(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onIntermediateCatchEventFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onProcessError(identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onCronjobCreated(identity, callback, subscribeOnce);
  }

  public async onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onCronjobExecuted(identity, callback, subscribeOnce);
  }

  public async onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onCronjobStopped(identity, callback, subscribeOnce);
  }

  public async onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onCronjobUpdated(identity, callback, subscribeOnce);
  }

  public async onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.notificationService.onCronjobRemoved(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    return this.notificationService.removeSubscription(identity, subscription);
  }

  // Correlations
  public async getAllCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {
    return this.correlationService.getAllCorrelations(identity, offset, limit);
  }

  public async getActiveCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {
    return this.correlationService.getActiveCorrelations(identity, offset, limit);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {
    return this.correlationService.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationsByProcessModelId(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {
    return this.correlationService.getCorrelationsByProcessModelId(identity, processModelId, offset, limit);
  }

  public async getProcessInstanceById(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.ProcessInstance> {
    return this.correlationService.getProcessInstanceById(identity, processInstanceId);
  }

  public async getProcessInstancesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {
    return this.correlationService.getProcessInstancesForCorrelation(identity, correlationId, offset, limit);
  }

  public async getProcessInstancesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {
    return this.correlationService.getProcessInstancesForProcessModel(identity, processModelId, offset, limit);
  }

  public async getProcessInstancesByState(
    identity: IIdentity,
    state: DataModels.Correlations.CorrelationState,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {
    return this.correlationService.getProcessInstancesByState(identity, state, offset, limit);
  }

  // Cronjobs
  public async getAllActiveCronjobs(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobList> {
    return this.cronjobService.getAllActiveCronjobs(identity, offset, limit);
  }

  public async getCronjobExecutionHistoryForProcessModel(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {
    return this.cronjobService.getCronjobExecutionHistoryForProcessModel(identity, processModelId, startEventId, offset, limit);
  }

  public async getCronjobExecutionHistoryForCrontab(
    identity: IIdentity,
    crontab: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {
    return this.cronjobService.getCronjobExecutionHistoryForCrontab(identity, crontab, offset, limit);
  }

  // ProcessModels
  public async getProcessModels(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ProcessModels.ProcessModelList> {
    return this.processModelService.getProcessModels(identity, offset, limit);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.processModelService.getProcessModelById(identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.processModelService.getProcessModelByProcessInstanceId(identity, processInstanceId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload?: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    return this.processModelService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    return this.processModelService.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {
    return this.processModelService.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    return this.processModelService.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {
    return this.processModelService.terminateProcessInstance(identity, processInstanceId);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.emptyActivityService.getEmptyActivitiesForProcessModel(identity, processModelId, offset, limit);
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.emptyActivityService.getEmptyActivitiesForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getEmptyActivitiesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.emptyActivityService.getEmptyActivitiesForCorrelation(identity, correlationId, offset, limit);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.emptyActivityService.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    return this.emptyActivityService.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // Events
  public async getWaitingEventsForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {
    return this.eventService.getWaitingEventsForProcessModel(identity, processModelId, offset, limit);
  }

  public async getWaitingEventsForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {
    return this.eventService.getWaitingEventsForCorrelation(identity, correlationId, offset, limit);
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {
    return this.eventService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.eventService.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.eventService.triggerSignalEvent(identity, signalName, payload);
  }

  // FlowNodeInstances
  public async getFlowNodeInstancesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.FlowNodeInstanceList> {
    return this.flowNodeInstanceService.getFlowNodeInstancesForProcessInstance(identity, processInstanceId, offset, limit);
  }

  // Tasks
  public async getAllSuspendedTasks(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    return this.flowNodeInstanceService.getAllSuspendedTasks(identity, offset, limit);
  }

  public async getSuspendedTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    return this.flowNodeInstanceService.getSuspendedTasksForProcessModel(identity, processModelId, offset, limit);
  }

  public async getSuspendedTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    return this.flowNodeInstanceService.getSuspendedTasksForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getSuspendedTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {
    return this.flowNodeInstanceService.getSuspendedTasksForCorrelation(identity, correlationId, offset, limit);
  }

  public async getSuspendedTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    return this.flowNodeInstanceService.getSuspendedTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.manualTaskService.getManualTasksForProcessModel(identity, processModelId, offset, limit);
  }

  public async getManualTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.manualTaskService.getManualTasksForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getManualTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.manualTaskService.getManualTasksForCorrelation(identity, correlationId, offset, limit);
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.manualTaskService.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    return this.manualTaskService.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // UserTasks
  public async getUserTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    return this.userTaskService.getUserTasksForProcessModel(identity, processModelId, offset, limit);
  }

  public async getUserTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    return this.userTaskService.getUserTasksForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getUserTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    return this.userTaskService.getUserTasksForCorrelation(identity, correlationId, offset, limit);
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    return this.userTaskService.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    return this.userTaskService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformationList> {
    return this.kpiService.getRuntimeInformationForProcessModel(identity, processModelId, offset, limit);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {
    return this.kpiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    return this.kpiService.getActiveTokensForProcessModel(identity, processModelId, offset, limit);
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    return this.kpiService.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId, offset, limit);
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    return this.kpiService.getActiveTokensForProcessInstance(identity, processInstanceId, offset, limit);
  }

  public async getActiveTokensForFlowNode(
    identity: IIdentity,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {
    return this.kpiService.getActiveTokensForFlowNode(identity, flowNodeId, offset, limit);
  }

  public async getProcessModelLog(
    identity: IIdentity,
    processModelId: string,
    correlationId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {
    return this.loggingService.getProcessModelLog(identity, processModelId, correlationId, offset, limit);
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {
    return this.loggingService.getProcessInstanceLog(identity, processModelId, processInstanceId, offset, limit);
  }

  public async getTokensForFlowNode(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.TokenHistory.TokenHistoryEntryList> {
    return this.tokenHistoryService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId, offset, limit);
  }

  public async getTokensForFlowNodeByProcessInstanceId(
    identity: IIdentity,
    processInstanceId: string,
    flowNodeId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    return this.tokenHistoryService.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    return this.tokenHistoryService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    return this.tokenHistoryService.getTokensForProcessInstance(identity, processInstanceId);
  }

}
