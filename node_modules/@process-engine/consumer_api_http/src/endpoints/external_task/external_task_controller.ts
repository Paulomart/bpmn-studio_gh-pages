import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/consumer_api_contracts';

import {Response} from 'express';

export class ExternalTaskController implements HttpController.IExternalTaskHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private externalTaskService: APIs.IExternalTaskConsumerApi;

  constructor(externalTaskService: APIs.IExternalTaskConsumerApi) {
    this.externalTaskService = externalTaskService;
  }

  public async fetchAndLockExternalTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const identity = request.identity;

    const payload = request.body;

    const result = await this.externalTaskService.fetchAndLockExternalTasks(
      identity,
      payload.workerId,
      payload.topicName,
      payload.maxTasks,
      payload.longPollingTimeout,
      payload.lockDuration,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async extendLock(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskService.extendLock(identity, payload.workerId, externalTaskId, payload.additionalDuration);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleBpmnError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskService.handleBpmnError(identity, payload.workerId, externalTaskId, payload.errorCode, payload.errorMessage);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleServiceError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this
      .externalTaskService
      .handleServiceError(identity, payload.workerId, externalTaskId, payload.errorMessage, payload.errorDetails, payload.errorCode);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async finishExternalTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskService.finishExternalTask(identity, payload.workerId, externalTaskId, payload.result);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
