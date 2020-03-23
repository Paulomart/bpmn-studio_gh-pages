import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IConsumerApi,
  IConsumerApiAccessor,
  Messages,
} from '@process-engine/consumer_api_contracts';

export class ConsumerApiClientService implements IConsumerApi {

  private consumerApiAccessor: IConsumerApiAccessor = undefined;

  constructor(consumerApiAccessor: IConsumerApiAccessor) {
    this.consumerApiAccessor = consumerApiAccessor;
  }

  // Notifications
  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onBoundaryEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onIntermediateThrowEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onIntermediateCatchEventReached(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onIntermediateCatchEventFinished(identity, callback, subscribeOnce);
  }

  public async onCallActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onCallActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onCallActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onCallActivityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.removeSubscription(identity, subscription);
  }

  // Process models and instances
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getProcessModelById(identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getProcessModelByProcessInstanceId(identity, processInstanceId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this.ensureIsAuthorized(identity);

    let startCallbackTypeToUse = startCallbackType;

    const useDefaultStartCallbackType = !startCallbackTypeToUse;
    if (useDefaultStartCallbackType) {
      startCallbackTypeToUse = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const invalidStartCallbackType = !Object.values(DataModels.ProcessModels.StartCallbackType).includes(startCallbackTypeToUse);
    if (invalidStartCallbackType) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackTypeToUse} is not a valid return option!`);
    }

    const noEndEventIdProvided = startCallbackTypeToUse === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached && !endEventId;
    if (noEndEventIdProvided) {
      throw new EssentialProjectErrors.BadRequestError('Must provide an EndEventId, when using callback type \'CallbackOnEndEventReached\'!');
    }

    return this.consumerApiAccessor.startProcessInstance(identity, processModelId, payload, startCallbackTypeToUse, startEventId, endEventId);
  }

  public async getProcessResultForCorrelation(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.CorrelationResult>> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getProcessResultForCorrelation(identity, correlationId, processModelId);
  }

  public async getProcessInstancesByIdentity(identity: IIdentity): Promise<Array<DataModels.ProcessInstance>> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getProcessInstancesByIdentity(identity);
  }

  // Events
  public async getEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEventsForProcessModel(identity, processModelId);
  }

  public async getEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEventsForCorrelation(identity, correlationId);
  }

  public async getEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.triggerSignalEvent(identity, signalName, payload);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEmptyActivitiesForProcessModel(identity, processModelId);
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEmptyActivitiesForProcessInstance(identity, processInstanceId);
  }

  public async getEmptyActivitiesForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEmptyActivitiesForCorrelation(identity, correlationId);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async getWaitingEmptyActivitiesByIdentity(identity: IIdentity): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getWaitingEmptyActivitiesByIdentity(identity);
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getUserTasksForProcessInstance(identity, processInstanceId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async getWaitingUserTasksByIdentity(identity: IIdentity): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getWaitingUserTasksByIdentity(identity);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getManualTasksForProcessModel(identity, processModelId);
  }

  public async getManualTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getManualTasksForProcessInstance(identity, processInstanceId);
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getManualTasksForCorrelation(identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async getWaitingManualTasksByIdentity(identity: IIdentity): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.getWaitingManualTasksByIdentity(identity);
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.consumerApiAccessor.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  private ensureIsAuthorized(identity: IIdentity): void {
    const noAuthTokenProvided = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }

}
