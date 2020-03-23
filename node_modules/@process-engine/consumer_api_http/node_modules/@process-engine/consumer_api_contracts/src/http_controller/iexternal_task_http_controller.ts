import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for managing HttpRequests related to ExternalTasks.
 */
export interface IExternalTaskHttpController {

  /**
   * Fetches the tasks available for a particular (external) service and locks
   * them for a defined time.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  fetchAndLockExternalTasks(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Extends the timeout of a lock by a given amount of time.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  extendLock(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Reports a business error in the context of a running ExternalTask
   * with a specific ID.
   * The error code must be specified to identify the BPMN error handler.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  handleBpmnError(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Reports a failure to execute an ExternalTask with a specific ID.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  handleServiceError(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Completes an ExternalTask by ID and updates any related process variables.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  finishExternalTask(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
