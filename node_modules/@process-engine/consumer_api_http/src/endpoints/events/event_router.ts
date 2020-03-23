import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/consumer_api_contracts';

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
    return 'api/consumer/v1';
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

    this.router.get(restSettings.paths.processModelEvents, wrap(controller.getEventsForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.correlationEvents, wrap(controller.getEventsForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.processModelCorrelationEvents, wrap(controller.getEventsForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.triggerMessageEvent, wrap(controller.triggerMessageEvent.bind(controller)));
    this.router.post(restSettings.paths.triggerSignalEvent, wrap(controller.triggerSignalEvent.bind(controller)));
  }

}
