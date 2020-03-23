import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {TokenHistoryController} from './token_history_controller';

export class TokenHistoryRouter extends BaseRouter {

  private identityService: IIdentityService;
  private tokenHistoryController: TokenHistoryController;

  constructor(tokenHistoryController: TokenHistoryController, identityService: IIdentityService) {
    super();
    this.tokenHistoryController = tokenHistoryController;
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
    const controller = this.tokenHistoryController;

    this.router.get(restSettings.paths.getTokensForFlowNode, wrap(controller.getTokensForFlowNode.bind(controller)));
    this.router.get(
      restSettings.paths.getTokensForFlowNodeByProcessInstanceId,
      wrap(controller.getTokensForFlowNodeByProcessInstanceId.bind(controller)),
    );
    this.router.get(restSettings.paths.getTokensForProcessInstance, wrap(controller.getTokensForProcessInstance.bind(controller)));
    this.router.get(
      restSettings.paths.getTokensForCorrelationAndProcessModel,
      wrap(controller.getTokensForCorrelationAndProcessModel.bind(controller)),
    );
  }

}
