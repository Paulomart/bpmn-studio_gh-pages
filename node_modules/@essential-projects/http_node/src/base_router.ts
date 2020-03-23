/* eslint-disable no-return-await */
import {IHttpRouter} from '@essential-projects/http_contracts';
import * as express from 'express';

export abstract class BaseRouter implements IHttpRouter {

  public config: any = undefined;

  // eslint-disable-next-line @typescript-eslint/member-naming
  private _router: express.Router = undefined;

  public get router(): express.Router {
    if (!this._router) {
      // eslint-disable-next-line 6river/new-cap
      this._router = express.Router();
    }

    return this._router;
  }

  public get baseRoute(): string {
    const baseRoute = this.config.baseRoute;
    if (!baseRoute) {
      return '';
    }

    return baseRoute;
  }

  public initialize(): Promise<any> | any {
    return this.invokeAsPromiseIfPossible(this.initializeRouter, this);
  }

  public abstract initializeRouter(): Promise<any> | any;

  /**
   * Inheriting routers can override this method to cleanup on shutdown.
   */
  public dispose(): Promise<void> | void { }

  protected async invokeAsPromiseIfPossible(functionToInvoke: any, invocationContext: any, invocationParameter?: Array<any>): Promise<any> {

    const isValidFunction = typeof functionToInvoke === 'function';

    if (!isValidFunction) {
      return Promise.resolve();
    }

    return await functionToInvoke.call(invocationContext, invocationParameter);
  }

}
