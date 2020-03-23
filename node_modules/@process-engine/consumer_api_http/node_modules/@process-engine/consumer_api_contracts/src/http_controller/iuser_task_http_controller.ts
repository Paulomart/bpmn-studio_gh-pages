import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for managing HttpRequests related to UserTasks.
 */
export interface IUserTaskHttpController {

  /**
   * Retrieves a list of all suspended UserTasks belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getUserTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended UserTasks belonging to specific
   * ProcessInstance.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getUserTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended UserTasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getUserTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended UserTasks belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getUserTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Gets all waiting UserTasks belonging to the given identity.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getWaitingUserTasksByIdentity(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Finishes a UserTask belonging to an instance of a specific ProcessModel
   * within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  finishUserTask(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
