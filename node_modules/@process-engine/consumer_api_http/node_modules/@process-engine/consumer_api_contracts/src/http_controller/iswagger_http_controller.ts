import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for getting the swagger config.
 */
export interface ISwaggerHttpController {

  /**
   * Retrieves the swagger config.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getSwaggerJson(request: HttpRequestWithIdentity, response: Response): Promise<void>;

}
