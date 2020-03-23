import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for managing HttpRequests related to ManualTasks.
 */
export interface IManualTaskHttpController {

  /**
   * Retrieves a list of all suspended ManualTasks belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getManualTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended ManualTasks belonging to a specific
   * ProcessInstance.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getManualTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended ManualTasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getManualTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended ManualTasks belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getManualTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Gets all waiting ManualTasks belonging to the given identity.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getWaitingManualTasksByIdentity(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Finishes a ManualTask belonging to an instance of a specific ProcessModel
   * within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  finishManualTask(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
