import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:process_model');

export class ProcessModelSocketEndpoint extends BaseSocketEndpoint {

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

    this.endpointSubscriptions.push(processStartedSubscription);
    this.endpointSubscriptions.push(processEndedSubscription);
    this.endpointSubscriptions.push(processTerminatedSubscription);
    this.endpointSubscriptions.push(processErrorSubscription);
  }

}
