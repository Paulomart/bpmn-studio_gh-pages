import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class KpiController implements HttpController.IKpiHttpController {

  private httpCodeSuccessfulResponse = 200;

  private kpiService: APIs.IKpiManagementApi;

  constructor(kpiService: APIs.IKpiManagementApi) {
    this.kpiService = kpiService;
  }

  public async getRuntimeInformationForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.kpiService.getRuntimeInformationForProcessModel(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getRuntimeInformationForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const flowNodeId = request.params.flow_node_id;

    const result = await this.kpiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.kpiService.getActiveTokensForProcessModel(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.kpiService.getActiveTokensForProcessInstance(identity, processInstanceId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this
      .kpiService
      .getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const flowNodeId = request.params.flow_node_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.kpiService.getActiveTokensForFlowNode(identity, flowNodeId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
