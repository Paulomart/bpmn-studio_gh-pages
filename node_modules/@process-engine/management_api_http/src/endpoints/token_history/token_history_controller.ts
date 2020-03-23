import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class TokenHistoryController implements HttpController.ITokenHistoryHttpController {

  private httpCodeSuccessfulResponse = 200;

  private tokenHistoryService: APIs.ITokenHistoryManagementApi;

  constructor(tokenHistoryService: APIs.ITokenHistoryManagementApi) {
    this.tokenHistoryService = tokenHistoryService;
  }

  public async getTokensForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;
    const flowNodeId = request.params.flow_node_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.tokenHistoryService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForFlowNodeByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const flowNodeId = request.params.flow_node_id;

    const result = await this.tokenHistoryService.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;

    const result = await this.tokenHistoryService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;

    const result = await this.tokenHistoryService.getTokensForProcessInstance(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
