import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/consumer_api_contracts';

import {ExternalTaskController} from './external_task_controller';
import {createResolveIdentityMiddleware} from '../../middlewares/index';

/**
 * This router provides the old endpoints for the ExternalTaskAPI.
 * Those routes will be removed in future versions, after users had time
 * to adjust their usage of ExternalTasks.
 */
export class ExternalTaskRouterDeprecated extends BaseRouter {

  private externalTaskController: ExternalTaskController;
  private identityService: IIdentityService;

  constructor(externalTaskController: ExternalTaskController, identityService: IIdentityService) {
    super();
    this.externalTaskController = externalTaskController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/external_task/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();

    const controller = this.externalTaskController;

    this.router.post(restSettings.paths.fetchAndLockExternalTasks, wrap(controller.fetchAndLockExternalTasks.bind(controller)));
    this.router.post(restSettings.paths.extendExternalTaskLock, wrap(controller.extendLock.bind(controller)));
    this.router.post(restSettings.paths.finishExternalTaskWithBpmnError, wrap(controller.handleBpmnError.bind(controller)));
    this.router.post(restSettings.paths.finishExternalTaskWithServiceError, wrap(controller.handleServiceError.bind(controller)));
    this.router.post(restSettings.paths.finishExternalTask, wrap(controller.finishExternalTask.bind(controller)));
  }

  private registerMiddlewares(): void {
    const resolveIdentity = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

}
