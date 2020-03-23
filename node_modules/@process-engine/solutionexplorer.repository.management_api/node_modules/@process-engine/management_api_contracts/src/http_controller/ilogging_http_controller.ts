import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for managing HttpRequests related to Logs.
 */
export interface ILoggingHttpController {

  /**
   * Retrieves the logs for a specific ProcessModel.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessModelLog(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves the logs for a specific ProcessInstance.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessInstanceLog(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
