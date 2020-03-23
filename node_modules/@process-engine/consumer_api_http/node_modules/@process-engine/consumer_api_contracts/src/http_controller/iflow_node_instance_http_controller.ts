import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for managing HttpRequests related to Tasks.
 */
export interface IFlowNodeInstanceHttpController {

  /**
   * Retrieves a list of all suspended Tasks.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getAllSuspendedTasks(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended Tasks belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getSuspendedTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended Tasks belonging to specific
   * ProcessInstance.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getSuspendedTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended Tasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getSuspendedTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended Tasks belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getSuspendedTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
