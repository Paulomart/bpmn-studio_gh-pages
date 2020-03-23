import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/consumer_api_contracts';

import {Response} from 'express';

export class FlowNodeInstanceController implements HttpController.IFlowNodeInstanceHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private flowNodenstanceService: APIs.IFlowNodeInstanceConsumerApi;

  constructor(flowNodenstanceService: APIs.IFlowNodeInstanceConsumerApi) {
    this.flowNodenstanceService = flowNodenstanceService;
  }

  public async getAllSuspendedTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodenstanceService.getAllSuspendedTasks(
      identity,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodenstanceService.getSuspendedTasksForProcessModel(
      identity,
      processModelId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodenstanceService.getSuspendedTasksForProcessInstance(
      identity,
      processInstanceId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodenstanceService.getSuspendedTasksForCorrelation(
      identity,
      correlationId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodenstanceService.getSuspendedTasksForProcessModelInCorrelation(
      identity,
      processModelId,
      correlationId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
