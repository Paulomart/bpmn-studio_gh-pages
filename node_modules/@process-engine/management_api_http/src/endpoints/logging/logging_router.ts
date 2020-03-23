import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {LoggingController} from './logging_controller';

export class LoggingRouter extends BaseRouter {

  private identityService: IIdentityService;
  private loggingController: LoggingController;

  constructor(loggingController: LoggingController, identityService: IIdentityService) {
    super();
    this.loggingController = loggingController;
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
    const controller = this.loggingController;

    this.router.get(restSettings.paths.getProcessModelLog, wrap(controller.getProcessModelLog.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstanceLog, wrap(controller.getProcessInstanceLog.bind(controller)));
  }

}
