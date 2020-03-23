import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {Response} from 'express';

/**
 * The ITokenHistoryManagementApi is used to read the TokenHistory for
 * FlowNodes and ProcessModels.
 */
export interface ITokenHistoryHttpController {

  /**
   * Gets the token history for a specific FlowNode of a ProcessModel.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getTokensForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Gets the token history for a specific FlowNodeInstance of a
   * ProcessInstance.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getTokensForFlowNodeByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Gets the token history for a given CorrelationId and ProcessModelId.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Gets the token history for a given ProcessInstanceId.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getTokensForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
