import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/consumer_api_contracts';

import {Response} from 'express';

export class ManualTaskController implements HttpController.IManualTaskHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private manualTaskService: APIs.IManualTaskConsumerApi;

  constructor(manualTaskService: APIs.IManualTaskConsumerApi) {
    this.manualTaskService = manualTaskService;
  }

  public async getManualTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.manualTaskService.getManualTasksForProcessModel(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.manualTaskService.getManualTasksForProcessInstance(identity, processInstanceId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.manualTaskService.getManualTasksForCorrelation(identity, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.manualTaskService.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingManualTasksByIdentity(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.manualTaskService.getWaitingManualTasksByIdentity(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishManualTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const manualTaskInstanceId = request.params.manual_task_instance_id;

    await this.manualTaskService.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
