import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import * as path from 'path';

import {HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class SwaggerController implements HttpController.ISwaggerHttpController {

  private httpCodeSuccessfulResponse = 200;

  public async getSwaggerJson(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    response.status(this.httpCodeSuccessfulResponse).sendFile(path.resolve(__dirname, '..', '..', '..', '..', 'swagger.json'));
  }

}
