import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {APIs, Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:empty_activity');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class EmptyActivitySocketEndpoint extends BaseSocketEndpoint {

  private connections: Map<string, IIdentity> = new Map();

  private notificationService: APIs.INotificationManagementApi;
  private eventAggregator: IEventAggregator;
  private identityService: IIdentityService;

  private endpointSubscriptions: Array<Subscription> = [];
  private userSubscriptions: UserSubscriptionDictionary = {};

  constructor(
    eventAggregator: IEventAggregator,
    identityService: IIdentityService,
    notificationService: APIs.INotificationManagementApi,
  ) {
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
        socket.disconnect();
        throw new UnauthorizedError('No auth token provided!');
      }

      const identity = await this.identityService.getIdentity(token);

      this.connections.set(socket.id, identity);

      logger.info(`Client with socket id "${socket.id} connected."`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('disconnect', async (reason: any): Promise<void> => {
        this.connections.delete(socket.id);

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
        (emptyActivityWaitingMessage: Messages.SystemEvents.EmptyActivityReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.emptyActivityWaiting, emptyActivityWaitingMessage);
        },
      );

    const emptyActivityFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.emptyActivityFinished,
        (emptyActivityFinishedMessage: Messages.SystemEvents.EmptyActivityFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.emptyActivityFinished, emptyActivityFinishedMessage);
        },
      );

    this.endpointSubscriptions.push(emptyActivityReachedSubscription);
    this.endpointSubscriptions.push(emptyActivityFinishedSubscription);
  }

  /**
   * Creates a number of Subscriptions for events that are only published for
   * certain identities.
   * An example would be "EmptyActivity started by User with ID 123456".
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
        (message: Messages.SystemEvents.UserTaskReachedMessage): void => {

          const eventToPublish = socketSettings.paths.emptyActivityForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onEmptyActivityForIdentityFinishedSubscription =
      await this.notificationService.onEmptyActivityForIdentityFinished(
        identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage): void => {

          const eventToPublish = socketSettings.paths.emptyActivityForIdentityFinished
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    userSubscriptions.push(onEmptyActivityForIdentityWaitingSubscription);
    userSubscriptions.push(onEmptyActivityForIdentityFinishedSubscription);

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
