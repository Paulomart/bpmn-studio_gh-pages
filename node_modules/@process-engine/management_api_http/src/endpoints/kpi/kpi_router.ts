import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {KpiController} from './kpi_controller';

export class KpiRouter extends BaseRouter {

  private identityService: IIdentityService;
  private kpiController: KpiController;

  constructor(kpiController: KpiController, identityService: IIdentityService) {
    super();
    this.kpiController = kpiController;
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
    const controller = this.kpiController;

    this.router.get(restSettings.paths.getRuntimeInformationForProcessModel, wrap(controller.getRuntimeInformationForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessModel, wrap(controller.getActiveTokensForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getRuntimeInformationForFlowNode, wrap(controller.getRuntimeInformationForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForFlowNode, wrap(controller.getActiveTokensForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessInstance, wrap(controller.getActiveTokensForProcessInstance.bind(controller)));
    this.router.get(
      restSettings.paths.getActiveTokensForCorrelationAndProcessModel,
      wrap(controller.getActiveTokensForCorrelationAndProcessModel.bind(controller)),
    );
  }

}
