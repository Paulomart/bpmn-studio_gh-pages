import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes an HttpController for getting information about the running application.
 */
export interface IApplicationInfoController {

  /**
   * Gets the package name and version of the running application.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending an Http response.
   */
  getApplicationInfo(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
