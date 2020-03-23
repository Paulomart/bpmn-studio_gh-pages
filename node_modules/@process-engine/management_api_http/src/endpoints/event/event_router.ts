import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {EventController} from './event_controller';

export class EventRouter extends BaseRouter {

  private eventController: EventController;
  private identityService: IIdentityService;

  constructor(eventController: EventController, identityService: IIdentityService) {
    super();
    this.eventController = eventController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller = this.eventController;

    this.router.get(restSettings.paths.waitingProcessModelEvents, wrap(controller.getWaitingEventsForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.waitingCorrelationEvents, wrap(controller.getWaitingEventsForCorrelation.bind(controller)));
    this.router.get(
      restSettings.paths.waitingProcessModelCorrelationEvents,
      wrap(controller.getWaitingEventsForProcessModelInCorrelation.bind(controller)),
    );
    this.router.post(restSettings.paths.triggerMessageEvent, wrap(controller.triggerMessageEvent.bind(controller)));
    this.router.post(restSettings.paths.triggerSignalEvent, wrap(controller.triggerSignalEvent.bind(controller)));
  }

}
