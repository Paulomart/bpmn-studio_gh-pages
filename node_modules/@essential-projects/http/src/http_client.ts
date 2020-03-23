/* eslint-disable no-param-reassign */
import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import * as popsicle from 'popsicle';

export class HttpClient implements IHttpClient {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public config: any = undefined;

  private httpSuccessResponseCode = 200;
  private httpRedirectResponseCode = 300;

  public async get<TResponse>(url: string, options?: IRequestOptions): Promise<IResponse<TResponse>> {

    const requestOptions = this.buildRequestOptions('GET', url, options);

    const response = await popsicle.request(requestOptions);

    const parsedResponse = this.evaluateResponse<TResponse>(response);

    return parsedResponse;
  }

  public async post<TPayload, TResult>(url: string, data: TPayload, options?: IRequestOptions): Promise<IResponse<TResult>> {

    const requestOptions = this.buildRequestOptions('POST', url, options);

    requestOptions.body = data;

    const response = await popsicle.request(requestOptions);

    const parsedResponse = this.evaluateResponse<TResult>(response);

    return parsedResponse;
  }

  public async put<TResult>(url: string, data: TResult, options?: IRequestOptions): Promise<IResponse<TResult>> {

    const requestOptions = this.buildRequestOptions('PUT', url, options);

    requestOptions.body = data;

    const response = await popsicle.request(requestOptions);

    const parsedResponse = this.evaluateResponse<TResult>(response);

    return parsedResponse;
  }

  public async delete<TResult>(url: string, options?: IRequestOptions): Promise<IResponse<TResult>> {

    const requestOptions = this.buildRequestOptions('DELETE', url, options);

    const response = await popsicle.request(requestOptions);

    const parsedResponse = this.evaluateResponse<TResult>(response);

    return parsedResponse;
  }

  protected buildRequestOptions(method: string, url: string, options?: IRequestOptions): popsicle.RequestOptions {

    const baseUrl = this.config && this.config.url ? `${this.config.url}/` : '';

    const requestOptions: popsicle.RequestOptions = {
      method: method,
      url: `${baseUrl}${url}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (options) {
      Object.assign(requestOptions, options);
    }

    if (requestOptions.query) {
      this.deleteEmptyOptions(requestOptions.query);
    }

    return requestOptions;
  }

  private deleteEmptyOptions(options: any): void {

    const propertyKeys: Array<string> = Object.keys(options);

    propertyKeys.forEach((attributeKey: string): void => {

      const value = options[attributeKey];
      if (!value) {
        delete options[attributeKey];
      }
      if (Array.isArray(value) && value.length === 0) {
        delete options[attributeKey];
      }
    });
  }

  private evaluateResponse<TResponse>(response: any): IResponse<TResponse> {

    if (this.responseIsAnError(response)) {
      this.createAndThrowEssentialProjectsError(response);
    }

    const parsedResponse: IResponse<TResponse> = {
      result: this.parseResponseBody(response.body),
      status: response.status,
    };

    return parsedResponse;
  }

  private responseIsAnError(response: any): boolean {
    return response.status < this.httpSuccessResponseCode || response.status >= this.httpRedirectResponseCode;
  }

  private createAndThrowEssentialProjectsError(response: any): void {
    const responseStatusCode = response.status;
    const errorName = EssentialProjectErrors.ErrorCodes[responseStatusCode];

    if (!this.isEssentialProjectsError(errorName)) {
      throw new Error(response.body);
    }

    throw new EssentialProjectErrors[errorName](response.body);
  }

  private isEssentialProjectsError(errorName: string): boolean {
    return errorName in EssentialProjectErrors;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseResponseBody(result: any): any {
    // NOTE: For whatever reason, every response.body received by popsicle is a string,
    // even in a response header "Content-Type application/json" is set, or if the response body does not exist.
    // To get around this, we have to cast the result manually.
    try {
      return JSON.parse(result);
    } catch (error) {
      return result;
    }
  }

}
