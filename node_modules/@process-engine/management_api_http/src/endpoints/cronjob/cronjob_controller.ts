import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CronjobController implements HttpController.ICronjobHttpController {

  private httpCodeSuccessfulResponse = 200;

  private cronjobService: APIs.ICronjobManagementApi;

  constructor(cronjobService: APIs.ICronjobManagementApi) {
    this.cronjobService = cronjobService;
  }

  public async getAllActiveCronjobs(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.cronjobService.getAllActiveCronjobs(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCronjobExecutionHistoryForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const startEventId = request.query.start_event_id;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.cronjobService.getCronjobExecutionHistoryForProcessModel(identity, processModelId, startEventId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCronjobExecutionHistoryForCrontab(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const crontab = request.params.crontab;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.cronjobService.getCronjobExecutionHistoryForCrontab(identity, crontab, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
