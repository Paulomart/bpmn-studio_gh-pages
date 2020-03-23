import {EventReceivedCallback, IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {Messages} from '@process-engine/management_api_contracts';

import {
  ActivityFinishedMessage,
  ActivityReachedMessage,
  BaseSystemEventMessage,
  BoundaryEventTriggeredMessage,
  EndEventReachedMessage,
  IntermediateCatchEventFinishedMessage,
  IntermediateCatchEventReachedMessage,
  IntermediateThrowEventTriggeredMessage,
  ProcessErrorMessage,
  ProcessStartedMessage,
  TerminateEndEventReachedMessage,
  UserTaskFinishedMessage,
  UserTaskReachedMessage,
} from '@process-engine/process_engine_contracts';

export class NotificationAdapter {

  private readonly eventAggregator: IEventAggregator;

  constructor(eventAggregator: IEventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  public onActivityReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.activityReached;

    const sanitationCallback = (message: ActivityReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage<ActivityReachedMessage>(message);

      sanitizedMessage.flowNodeType = message.flowNodeType;

      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.activityFinished;

    const sanitationCallback = (message: ActivityFinishedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage<ActivityFinishedMessage>(message);

      sanitizedMessage.flowNodeType = message.flowNodeType;

      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.emptyActivityReached;

    const sanitationCallback = (message: ActivityFinishedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.emptyActivityFinished;

    const sanitationCallback = (message: ActivityReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.emptyActivityReached;

    const sanitationCallback = (message: ActivityFinishedMessage): void => {

      const identitiesMatch = this.checkIfIdentityUserIDsMatch(identity, message.processInstanceOwner);
      if (identitiesMatch) {
        const sanitizedMessage = this.sanitizeMessage(message);
        callback(sanitizedMessage);
      }
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.emptyActivityFinished;

    const sanitationCallback = (message: ActivityReachedMessage): void => {

      const identitiesMatch = this.checkIfIdentityUserIDsMatch(identity, message.processInstanceOwner);
      if (identitiesMatch) {
        const sanitizedMessage = this.sanitizeMessage(message);
        callback(sanitizedMessage);
      }
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onUserTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback, subscribeOnce: boolean): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.userTaskReached;

    const sanitationCallback = (message: UserTaskReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onUserTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback, subscribeOnce: boolean): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.userTaskFinished;

    const sanitationCallback = (message: UserTaskFinishedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage<Messages.SystemEvents.UserTaskFinishedMessage>(message);
      sanitizedMessage.userTaskResult = message.userTaskResult;
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.userTaskReached;

    const sanitationCallback = (message: UserTaskReachedMessage): void => {

      const identitiesMatch = this.checkIfIdentityUserIDsMatch(identity, message.processInstanceOwner);
      if (identitiesMatch) {
        const sanitizedMessage = this.sanitizeMessage(message);
        callback(sanitizedMessage);
      }
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.userTaskFinished;

    const sanitationCallback = (message: UserTaskFinishedMessage): void => {

      const identitiesMatch = this.checkIfIdentityUserIDsMatch(identity, message.processInstanceOwner);
      if (identitiesMatch) {
        const sanitizedMessage = this.sanitizeMessage<Messages.SystemEvents.UserTaskFinishedMessage>(message);
        sanitizedMessage.userTaskResult = message.userTaskResult;
        callback(sanitizedMessage);
      }
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.manualTaskReached;

    const sanitationCallback = (message: ActivityReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.manualTaskFinished;

    const sanitationCallback = (message: ActivityReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.manualTaskReached;

    const sanitationCallback = (message: ActivityReachedMessage): void => {

      const identitiesMatch = this.checkIfIdentityUserIDsMatch(identity, message.processInstanceOwner);
      if (identitiesMatch) {
        const sanitizedMessage = this.sanitizeMessage(message);
        callback(sanitizedMessage);
      }
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.manualTaskFinished;

    const sanitationCallback = (message: ActivityReachedMessage): void => {

      const identitiesMatch = this.checkIfIdentityUserIDsMatch(identity, message.processInstanceOwner);
      if (identitiesMatch) {
        const sanitizedMessage = this.sanitizeMessage(message);
        callback(sanitizedMessage);
      }
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.boundaryEventTriggered;

    const sanitationCallback = (message: BoundaryEventTriggeredMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.intermediateThrowEventTriggered;

    const sanitationCallback = (message: IntermediateThrowEventTriggeredMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.intermediateCatchEventReached;

    const sanitationCallback = (message: IntermediateCatchEventReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.intermediateCatchEventFinished;

    const sanitationCallback = (message: IntermediateCatchEventFinishedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onProcessStarted(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessStartedCallback, subscribeOnce: boolean): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.processStarted;

    const sanitationCallback = (message: ProcessStartedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.processStarted;

    const sanitationCallback = (message: ProcessStartedMessage): void => {

      const processModelIdsDoNotMatch = message.processModelId !== processModelId;
      if (processModelIdsDoNotMatch) {
        return;
      }

      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onProcessEnded(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessEndedCallback, subscribeOnce: boolean): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.processEnded;

    const sanitationCallback = (message: EndEventReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.processTerminated;

    const sanitationCallback = (message: TerminateEndEventReachedMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.processError;

    const sanitationCallback = (message: ProcessErrorMessage): void => {
      const sanitizedMessage = this.sanitizeMessage(message);
      callback(sanitizedMessage);
    };

    return this.createSubscription(eventName, sanitationCallback, subscribeOnce);
  }

  public onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.cronjobCreated;

    return this.createSubscription(eventName, callback, subscribeOnce);
  }

  public onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.cronjobExecuted;

    return this.createSubscription(eventName, callback, subscribeOnce);
  }

  public onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.cronjobStopped;

    return this.createSubscription(eventName, callback, subscribeOnce);
  }

  public onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.cronjobUpdated;

    return this.createSubscription(eventName, callback, subscribeOnce);
  }

  public onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce: boolean,
  ): Subscription {

    const eventName = Messages.EventAggregatorSettings.messagePaths.cronjobRemoved;

    return this.createSubscription(eventName, callback, subscribeOnce);
  }

  public removeSubscription(subscription: Subscription): void {
    this.eventAggregator.unsubscribe(subscription);
  }

  private createSubscription(eventName: string, callback: EventReceivedCallback, subscribeOnce: boolean): Subscription {

    if (subscribeOnce) {
      return this.eventAggregator.subscribeOnce(eventName, callback);
    }

    return this.eventAggregator.subscribe(eventName, callback);
  }

  private checkIfIdentityUserIDsMatch(identityA: IIdentity, identityB: IIdentity): boolean {
    return identityA.userId === identityB.userId;
  }

  private sanitizeMessage<TPublic extends Messages.BaseEventMessage>(internalMessage: BaseSystemEventMessage): TPublic {

    const sanitizedMessage = new Messages.BaseEventMessage(
      internalMessage.correlationId,
      internalMessage.processModelId,
      internalMessage.processInstanceId,
      internalMessage.flowNodeId,
      internalMessage.flowNodeInstanceId,
      internalMessage.currentToken,
    );

    return <TPublic> sanitizedMessage;
  }

}
