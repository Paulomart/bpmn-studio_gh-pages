import {BaseRouter} from '@essential-projects/http_node';

import {wrap} from 'async-middleware';
import {SwaggerController} from './swagger_controller';

export class SwaggerRouter extends BaseRouter {

  private swaggerController: SwaggerController;

  constructor(swaggerController: SwaggerController) {
    super();
    this.swaggerController = swaggerController;
  }

  public get baseRoute(): string {
    return 'api/consumer/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const controller = this.swaggerController;

    this.router.get('/swagger', wrap(controller.getSwaggerJson.bind(controller)));
  }

}
