import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Contains functions for a HTTP Controller that can be used for accessing
 * the Consumer API.
 */
export interface IConsumerApiHttpController {
  /**
   * Retrieves a list of all ProcessModels that the requesting user is
   * authorized to see.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a ProcessModel by its ID.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a ProcessModel by a ProcessInstanceID.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a HTTP response.
   */
  getProcessModelByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Starts a new instance of a ProcessModel with a specific ID.
   * Depending on the type of callback used, this function will resolve either
   * immediately after the ProcessInstance was started, or after it has reached
   * an EndEvent.
   * This can either be a specific EndEvent, or the first EndEvent encountered
   * during execution.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves the result of a specific ProcessModel within a Correlation.
   * This only works for ProcessInstances that have finished execution.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessResultForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all triggerable events belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all triggerable events belonging to a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getEventsForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all triggerable events belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getEventsForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Gets all active ProcessInstances belonging to the given identity.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessInstancesByIdentity(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Triggers a message event.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  triggerMessageEvent(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Triggers a signal event.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  triggerSignalEvent(request: HttpRequestWithIdentity, response: Response): Promise<void>;

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
