import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:cronjobs');

export class CronjobSocketEndpoint extends BaseSocketEndpoint {

  private connections: Map<string, IIdentity> = new Map();

  private eventAggregator: IEventAggregator;
  private identityService: IIdentityService;

  private endpointSubscriptions: Array<Subscription> = [];

  constructor(eventAggregator: IEventAggregator, identityService: IIdentityService) {
    super();
    this.eventAggregator = eventAggregator;
    this.identityService = identityService;
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
      socket.on('disconnect', (reason: any): void => {
        this.connections.delete(socket.id);
        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    await this.createSocketScopeNotifications(socketIo);
  }

  public async dispose(): Promise<void> {
    logger.info('Disposing Socket IO subscriptions...');
    for (const subscription of this.endpointSubscriptions) {
      this.eventAggregator.unsubscribe(subscription);
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

    const cronjobCreatedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobCreated,
        (cronjobCreatedMessage: Messages.SystemEvents.CronjobCreatedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobCreated, cronjobCreatedMessage);
        },
      );

    const cronjobExecutedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobExecuted,
        (cronjobExecutedMessage: Messages.SystemEvents.CronjobExecutedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobExecuted, cronjobExecutedMessage);
        },
      );

    const cronjobStoppedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobStopped,
        (cronjobStoppedMessage: Messages.SystemEvents.CronjobStoppedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobStopped, cronjobStoppedMessage);
        },
      );

    const cronjobUpdatedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobUpdated,
        (cronjobUpdatedMessage: Messages.SystemEvents.CronjobUpdatedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobUpdated, cronjobUpdatedMessage);
        },
      );

    const cronjobRemovedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobRemoved,
        (cronjobRemovedMessage: Messages.SystemEvents.CronjobRemovedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobRemoved, cronjobRemovedMessage);
        },
      );

    this.endpointSubscriptions.push(cronjobCreatedSubscription);
    this.endpointSubscriptions.push(cronjobExecutedSubscription);
    this.endpointSubscriptions.push(cronjobStoppedSubscription);
    this.endpointSubscriptions.push(cronjobUpdatedSubscription);
    this.endpointSubscriptions.push(cronjobRemovedSubscription);
  }

}
