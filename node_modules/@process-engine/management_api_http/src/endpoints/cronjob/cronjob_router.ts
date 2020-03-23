import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {CronjobController} from './cronjob_controller';

export class CronjobRouter extends BaseRouter {

  private cronjobController: CronjobController;
  private identityService: IIdentityService;

  constructor(cronjobController: CronjobController, identityService: IIdentityService) {
    super();
    this.cronjobController = cronjobController;
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
    const controller = this.cronjobController;

    this.router.get(restSettings.paths.getActiveCronjobs, wrap(controller.getAllActiveCronjobs.bind(controller)));

    this.router.get(
      restSettings.paths.getCronjobExecutionHistoryForProcessModel,
      wrap(controller.getCronjobExecutionHistoryForProcessModel.bind(controller)),
    );

    this.router.get(
      restSettings.paths.getCronjobExecutionHistoryForCrontab,
      wrap(controller.getCronjobExecutionHistoryForCrontab.bind(controller)),
    );
  }

}
