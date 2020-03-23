import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, DataModels, HttpController} from '@process-engine/consumer_api_contracts';

import {Response} from 'express';

export class ProcessModelController implements HttpController.IProcessModelHttpController {

  private httpCodeSuccessfulResponse: number = 200;

  private processModelService: APIs.IProcessModelConsumerApi;

  constructor(processModelService: APIs.IProcessModelConsumerApi) {
    this.processModelService = processModelService;
  }

  public async getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.processModelService.getProcessModels(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;

    const result = await this.processModelService.getProcessModelById(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;

    const result = await this.processModelService.getProcessModelByProcessInstanceId(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const startEventId = request.query.start_event_id;
    const endEventId = request.query.end_event_id;
    const payload = request.body;

    let startCallbackType = <DataModels.ProcessModels.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const identity = request.identity;

    const result = await this
      .processModelService
      .startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessResultForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;
    const identity = request.identity;

    const result = await this.processModelService.getProcessResultForCorrelation(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstancesByIdentity(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.processModelService.getProcessInstancesByIdentity(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
