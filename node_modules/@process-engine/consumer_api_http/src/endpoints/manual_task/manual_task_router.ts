import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/consumer_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {ManualTaskController} from './manual_task_controller';

export class ManualTaskRouter extends BaseRouter {

  private identityService: IIdentityService;
  private manualTaskController: ManualTaskController;

  constructor(manualTaskController: ManualTaskController, identityService: IIdentityService) {
    super();
    this.manualTaskController = manualTaskController;
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
    const controller = this.manualTaskController;

    this.router.get(restSettings.paths.processModelManualTasks, wrap(controller.getManualTasksForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.processInstanceManualTasks, wrap(controller.getManualTasksForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.correlationManualTasks, wrap(controller.getManualTasksForCorrelation.bind(controller)));
    this.router.get(
      restSettings.paths.processModelCorrelationManualTasks,
      wrap(controller.getManualTasksForProcessModelInCorrelation.bind(controller)),
    );
    this.router.get(restSettings.paths.getOwnManualTasks, wrap(controller.getWaitingManualTasksByIdentity.bind(controller)));
    this.router.post(restSettings.paths.finishManualTask, wrap(controller.finishManualTask.bind(controller)));
  }

}
