import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {CorrelationController} from './correlation_controller';

export class CorrelationRouter extends BaseRouter {

  private correlationController: CorrelationController;
  private identityService: IIdentityService;

  constructor(correlationController: CorrelationController, identityService: IIdentityService) {
    super();
    this.correlationController = correlationController;
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
    const controller = this.correlationController;

    this.router.get(restSettings.paths.getAllCorrelations, wrap(controller.getAllCorrelations.bind(controller)));
    this.router.get(restSettings.paths.getActiveCorrelations, wrap(controller.getActiveCorrelations.bind(controller)));
    this.router.get(restSettings.paths.getCorrelationById, wrap(controller.getCorrelationById.bind(controller)));
    this.router.get(restSettings.paths.getCorrelationsByProcessModelId, wrap(controller.getCorrelationsByProcessModelId.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstanceById, wrap(controller.getProcessInstanceById.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstancesForCorrelation, wrap(controller.getProcessInstancesForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstancesForProcessModel, wrap(controller.getProcessInstancesForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstancesByState, wrap(controller.getProcessInstancesByState.bind(controller)));
  }

}
