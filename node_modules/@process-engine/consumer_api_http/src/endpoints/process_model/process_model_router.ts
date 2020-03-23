import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/consumer_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {ProcessModelController} from './process_model_controller';

export class ProcessModelRouter extends BaseRouter {

  private identityService: IIdentityService;
  private processModelController: ProcessModelController;

  constructor(processModelController: ProcessModelController, identityService: IIdentityService) {
    super();
    this.processModelController = processModelController;
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
    const controller = this.processModelController;

    this.router.get(restSettings.paths.processModels, wrap(controller.getProcessModels.bind(controller)));
    this.router.get(restSettings.paths.processModelById, wrap(controller.getProcessModelById.bind(controller)));
    this.router.get(restSettings.paths.processModelByProcessInstanceId, wrap(controller.getProcessModelByProcessInstanceId.bind(controller)));
    this.router.get(restSettings.paths.getProcessResultForCorrelation, wrap(controller.getProcessResultForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.getOwnProcessInstances, wrap(controller.getProcessInstancesByIdentity.bind(controller)));
    this.router.post(restSettings.paths.startProcessInstance, wrap(controller.startProcessInstance.bind(controller)));
  }

}
