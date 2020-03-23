import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class FlowNodeInstanceController implements HttpController.IFlowNodeInstanceHttpController {

  private httpCodeSuccessfulResponse = 200;

  private flowNodeInstanceService: APIs.IFlowNodeInstanceManagementApi;

  constructor(flowNodeInstanceService: APIs.IFlowNodeInstanceManagementApi) {
    this.flowNodeInstanceService = flowNodeInstanceService;
  }

  public async getFlowNodeInstancesForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getFlowNodeInstancesForProcessInstance(
      identity,
      processInstanceId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getAllSuspendedTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getAllSuspendedTasks(
      identity,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getSuspendedTasksForProcessModel(
      identity,
      processModelId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getSuspendedTasksForProcessInstance(
      identity,
      processInstanceId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getSuspendedTasksForCorrelation(
      identity,
      correlationId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getSuspendedTasksForProcessModelInCorrelation(
      identity,
      processModelId,
      correlationId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
