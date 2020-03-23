import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/consumer_api_contracts';

import {Response} from 'express';

export class ApplicationInfoController implements HttpController.IApplicationInfoHttpController {

  private httpCodeSuccessfulResponse = 200;

  private applicationInfoService: APIs.IApplicationInfoConsumerApi;

  constructor(applicationInfoService: APIs.IApplicationInfoConsumerApi) {
    this.applicationInfoService = applicationInfoService;
  }

  public async getApplicationInfo(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const result = await this.applicationInfoService.getApplicationInfo(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
