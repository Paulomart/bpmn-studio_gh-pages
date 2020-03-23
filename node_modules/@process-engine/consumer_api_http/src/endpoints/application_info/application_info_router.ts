import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';

import {restSettings} from '@process-engine/consumer_api_contracts';

import {ApplicationInfoController} from './application_info_controller';

export class ApplicationInfoRouter extends BaseRouter {

  private applicationInfoController: ApplicationInfoController;

  constructor(applicationInfoController: ApplicationInfoController) {
    super();
    this.applicationInfoController = applicationInfoController;
  }

  public get baseRoute(): string {
    return 'api/consumer/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const controller = this.applicationInfoController;

    this.router.get(restSettings.paths.getApplicationInfo, wrap(controller.getApplicationInfo.bind(controller)));
  }

}
