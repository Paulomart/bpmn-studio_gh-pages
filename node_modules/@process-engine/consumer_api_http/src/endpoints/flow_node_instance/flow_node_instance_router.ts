import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/consumer_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {FlowNodeInstanceController} from './flow_node_instance_controller';

export class FlowNodeInstanceRouter extends BaseRouter {

  private identityService: IIdentityService;
  private flowNodeInstanceController: FlowNodeInstanceController;

  constructor(flowNodeInstanceController: FlowNodeInstanceController, identityService: IIdentityService) {
    super();
    this.flowNodeInstanceController = flowNodeInstanceController;
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
    const controller = this.flowNodeInstanceController;

    this.router.get(restSettings.paths.allSuspendedTasks, wrap(controller.getAllSuspendedTasks.bind(controller)));
    this.router.get(restSettings.paths.suspendedProcessModelTasks, wrap(controller.getSuspendedTasksForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.suspendedProcessInstanceTasks, wrap(controller.getSuspendedTasksForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.suspendedCorrelationTasks, wrap(controller.getSuspendedTasksForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.suspendedProcessModelCorrelationTasks, wrap(controller.getSuspendedTasksForProcessModelInCorrelation.bind(controller)));
  }

}
