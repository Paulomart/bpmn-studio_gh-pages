import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * Describes a HTTPController for managing HttpRequests related to Events.
 */
export interface IEventHttpController {

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
}
