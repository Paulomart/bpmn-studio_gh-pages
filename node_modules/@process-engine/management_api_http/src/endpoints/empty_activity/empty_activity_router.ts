import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {EmptyActivityController} from './empty_activity_controller';

export class EmptyActivityRouter extends BaseRouter {

  private identityService: IIdentityService;
  private emptyActivityController: EmptyActivityController;

  constructor(emptyActivityController: EmptyActivityController, identityService: IIdentityService) {
    super();
    this.emptyActivityController = emptyActivityController;
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
    const controller = this.emptyActivityController;

    this.router.get(restSettings.paths.processModelEmptyActivities, wrap(controller.getEmptyActivitiesForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.processInstanceEmptyActivities, wrap(controller.getEmptyActivitiesForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.correlationEmptyActivities, wrap(controller.getEmptyActivitiesForCorrelation.bind(controller)));
    this.router.get(
      restSettings.paths.processModelCorrelationEmptyActivities,
      wrap(controller.getEmptyActivitiesForProcessModelInCorrelation.bind(controller)),
    );
    this.router.post(restSettings.paths.finishEmptyActivity, wrap(controller.finishEmptyActivity.bind(controller)));
  }

}
