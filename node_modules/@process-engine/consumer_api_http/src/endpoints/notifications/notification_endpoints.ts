import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {APIs, Messages, socketSettings} from '@process-engine/consumer_api_contracts';

const logger: Logger = Logger.createLogger('consumer_api:http:socket.io_endpoint');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class NotificationSocketEndpoint extends BaseSocketEndpoint {

  private notificationService: APIs.INotificationConsumerApi;
  private eventAggregator: IEventAggregator;
  private identityService: IIdentityService;

  private endpointSubscriptions: Array<Subscription> = [];
  private userSubscriptions: UserSubscriptionDictionary = {};

  constructor(eventAggregator: IEventAggregator, identityService: IIdentityService, notificationService: APIs.INotificationConsumerApi) {
    super();
    this.eventAggregator = eventAggregator;
    this.identityService = identityService;
    this.notificationService = notificationService;
  }

  public get namespace(): string {
    return socketSettings.namespace;
  }

  public async initializeEndpoint(socketIo: SocketIO.Namespace): Promise<void> {

    socketIo.on('connect', async (socket: SocketIO.Socket): Promise<void> => {
      const token = socket.handshake.headers.authorization;

      const identityNotSet = token === undefined;
      if (identityNotSet) {
        logger.error('A Socket.IO client attempted to connect without providing an Auth-Token!');

        const unauthorizedError = new UnauthorizedError('No auth token provided!');
        socket.emit('error', unauthorizedError);
        socket.disconnect(true);

        return;
      }

      const identity = await this.identityService.getIdentity(token);

      logger.info(`Client with socket id "${socket.id} connected."`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('disconnect', async (reason: any): Promise<void> => {
        await this.clearUserScopeNotifications(identity);
        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });

      await this.createUserScopeNotifications(socket, identity);
    });

    await this.createSocketScopeNotifications(socketIo);
  }

  public async dispose(): Promise<void> {

    logger.info('Disposing Socket IO subscriptions...');
    // Clear out Socket-scope Subscriptions.
    for (const subscription of this.endpointSubscriptions) {
      this.eventAggregator.unsubscribe(subscription);
    }

    // Clear out all User-Subscriptions.
    // eslint-disable-next-line
    for (const userId in this.userSubscriptions) {
      const userSubscriptions = this.userSubscriptions[userId];

      for (const subscription of userSubscriptions) {
        this.eventAggregator.unsubscribe(subscription);
      }

      delete this.userSubscriptions[userId];
    }
  }

  /**
   * Creates a number of Subscriptions for globally published events.
   * These events will be published for every user connected to the socketIO
   * instance.
   *
   * @async
   * @param socketIoInstance The socketIO instance for which to create the
   *                         subscriptions.
   */
  private async createSocketScopeNotifications(socketIoInstance: SocketIO.Namespace): Promise<void> {

    const emptyActivityReachedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.emptyActivityReached,
        (emptyActivityWaitingMessage: Messages.SystemEvents.UserTaskReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.emptyActivityWaiting, emptyActivityWaitingMessage);
        },
      );

    const emptyActivityFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.emptyActivityFinished,
        (emptyActivityFinishedMessage: Messages.SystemEvents.UserTaskFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.emptyActivityFinished, emptyActivityFinishedMessage);
        },
      );

    const userTaskReachedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.userTaskReached,
        (userTaskWaitingMessage: Messages.SystemEvents.UserTaskReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.userTaskWaiting, userTaskWaitingMessage);
        },
      );

    const userTaskFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.userTaskFinished,
        (userTaskFinishedMessage: Messages.SystemEvents.UserTaskFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.userTaskFinished, userTaskFinishedMessage);
        },
      );

    const boundaryEventTriggeredSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.boundaryEventTriggered,
        (boundaryEventTriggeredMessage: Messages.SystemEvents.BoundaryEventTriggeredMessage): void => {
          socketIoInstance.emit(socketSettings.paths.boundaryEventTriggered, boundaryEventTriggeredMessage);
        },
      );

    const intermediateThrowEventTriggeredSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.intermediateThrowEventTriggered,
        (intermediateThrowEventTriggeredMessage: Messages.SystemEvents.IntermediateThrowEventTriggeredMessage): void => {
          socketIoInstance.emit(socketSettings.paths.intermediateThrowEventTriggered, intermediateThrowEventTriggeredMessage);
        },
      );

    const intermediateCatchEventReachedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.intermediateCatchEventReached,
        (intermediateCatchEventReachedMessage: Messages.SystemEvents.IntermediateCatchEventReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.intermediateCatchEventReached, intermediateCatchEventReachedMessage);
        },
      );

    const intermediateCatchEventFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.intermediateCatchEventFinished,
        (intermediateCatchEventFinishedMessage: Messages.SystemEvents.IntermediateCatchEventFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.intermediateCatchEventFinished, intermediateCatchEventFinishedMessage);
        },
      );

    const activityReachedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.activityReached,
        (activityReachedMessage: Messages.SystemEvents.ActivityReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.activityReached, activityReachedMessage);
        },
      );

    const activityFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.activityFinished,
        (activityFinishedMessage: Messages.SystemEvents.ActivityFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.activityFinished, activityFinishedMessage);
        },
      );

    const manualTaskReachedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.manualTaskReached,
        (manualTaskWaitingMessage: Messages.SystemEvents.ManualTaskReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.manualTaskWaiting, manualTaskWaitingMessage);
        },
      );

    const manualTaskFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.manualTaskFinished,
        (manualTaskFinishedMessage: Messages.SystemEvents.ManualTaskFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.manualTaskFinished, manualTaskFinishedMessage);
        },
      );

    const processStartedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.processStarted,
        (processStartedMessage: Messages.SystemEvents.ProcessStartedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.processStarted, processStartedMessage);

          const processInstanceStartedIdMessage: string =
            socketSettings.paths.processInstanceStarted
              .replace(socketSettings.pathParams.processModelId, processStartedMessage.processModelId);

          socketIoInstance.emit(processInstanceStartedIdMessage, processStartedMessage);
        },
      );

    const processEndedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.processEnded,
        (processEndedMessage: Messages.BpmnEvents.EndEventReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.processEnded, processEndedMessage);
        },
      );

    const processTerminatedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.processTerminated,
        (processTerminatedMessage: Messages.BpmnEvents.TerminateEndEventReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.processTerminated, processTerminatedMessage);
        },
      );

    const processErrorSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.processError,
        (processErrorMessage: Messages.SystemEvents.ProcessErrorMessage): void => {
          socketIoInstance.emit(socketSettings.paths.processError, processErrorMessage);
        },
      );

    this.endpointSubscriptions.push(activityReachedSubscription);
    this.endpointSubscriptions.push(activityFinishedSubscription);
    this.endpointSubscriptions.push(boundaryEventTriggeredSubscription);
    this.endpointSubscriptions.push(emptyActivityReachedSubscription);
    this.endpointSubscriptions.push(emptyActivityFinishedSubscription);
    this.endpointSubscriptions.push(intermediateThrowEventTriggeredSubscription);
    this.endpointSubscriptions.push(intermediateCatchEventReachedSubscription);
    this.endpointSubscriptions.push(intermediateCatchEventFinishedSubscription);
    this.endpointSubscriptions.push(userTaskReachedSubscription);
    this.endpointSubscriptions.push(userTaskFinishedSubscription);
    this.endpointSubscriptions.push(manualTaskReachedSubscription);
    this.endpointSubscriptions.push(manualTaskFinishedSubscription);
    this.endpointSubscriptions.push(processStartedSubscription);
    this.endpointSubscriptions.push(processEndedSubscription);
    this.endpointSubscriptions.push(processTerminatedSubscription);
    this.endpointSubscriptions.push(processErrorSubscription);
  }

  /**
   * Creates a number of Subscriptions for events that are only published for
   * certain identities.
   * An example would be "UserTask started by User with ID 123456".
   *
   * @async
   * @param socket   The socketIO client on which to create the subscriptions.
   * @param identity The identity for which to create the subscriptions
   */
  private async createUserScopeNotifications(socket: SocketIO.Socket, identity: IIdentity): Promise<void> {

    const userSubscriptions: Array<Subscription> = [];

    const onEmptyActivityForIdentityWaitingSubscription =
      await this.notificationService.onEmptyActivityForIdentityWaiting(
        identity,
        (message: Messages.SystemEvents.EmptyActivityReachedMessage): void => {

          const eventToPublish = socketSettings.paths.emptyActivityForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onEmptyActivityForIdentityFinishedSubscription =
      await this.notificationService.onEmptyActivityForIdentityFinished(
        identity,
        (message: Messages.SystemEvents.EmptyActivityReachedMessage): void => {

          const eventToPublish = socketSettings.paths.emptyActivityForIdentityFinished
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onUserTaskForIdentityWaitingSubscription =
      await this.notificationService.onUserTaskForIdentityWaiting(
        identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage): void => {

          const eventToPublish = socketSettings.paths.userTaskForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onUserTaskForIdentityFinishedSubscription =
      await this.notificationService.onUserTaskForIdentityFinished(
        identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage): void => {

          const eventToPublish = socketSettings.paths.userTaskForIdentityFinished
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onManualTaskForIdentityWaitingSubscription =
      await this.notificationService.onManualTaskForIdentityWaiting(
        identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage): void => {

          const eventToPublish = socketSettings.paths.manualTaskForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onManualTaskForIdentityFinishedSubscription =
      await this.notificationService.onManualTaskForIdentityFinished(
        identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage): void => {

          const eventToPublish = socketSettings.paths.manualTaskForIdentityFinished
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    userSubscriptions.push(onEmptyActivityForIdentityWaitingSubscription);
    userSubscriptions.push(onEmptyActivityForIdentityFinishedSubscription);
    userSubscriptions.push(onUserTaskForIdentityWaitingSubscription);
    userSubscriptions.push(onUserTaskForIdentityFinishedSubscription);
    userSubscriptions.push(onManualTaskForIdentityWaitingSubscription);
    userSubscriptions.push(onManualTaskForIdentityFinishedSubscription);

    this.userSubscriptions[identity.userId] = userSubscriptions;
  }

  /**
   * Clears out all Subscriptions for the given identity.
   * Should only be used when a client disconnects.
   *
   * @async
   * @param identity The identity for which to remove the Subscriptions.
   */
  private async clearUserScopeNotifications(identity: IIdentity): Promise<void> {

    logger.verbose(`Clearing subscriptions for user with ID ${identity.userId}`);
    const userSubscriptions = this.userSubscriptions[identity.userId];

    const noSubscriptionsFound = !userSubscriptions;
    if (noSubscriptionsFound) {
      logger.verbose(`No subscriptions for user with ID ${identity.userId} found.`);

      return;
    }

    for (const subscription of userSubscriptions) {
      await this.notificationService.removeSubscription(identity, subscription);
    }

    delete this.userSubscriptions[identity.userId];
  }

}
