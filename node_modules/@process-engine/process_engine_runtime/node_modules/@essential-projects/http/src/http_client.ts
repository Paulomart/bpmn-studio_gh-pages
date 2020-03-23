import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import * as popsicle from 'popsicle';

interface IErrorInfo {
  message: string;
  additionalInformation?: object;
}

export class HttpClient implements IHttpClient {

  public config: {[propertyName: string]: string};

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

    const baseUrl = this.config?.url ? `${this.config.url}/` : '';

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

  private deleteEmptyOptions(options: string | popsicle.Query): void {

    const propertyKeys = Object.keys(options);

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

  private evaluateResponse<TResponse>(response: popsicle.Response): IResponse<TResponse> {

    if (this.responseIsAnError(response)) {
      this.createAndThrowError(response);
    }

    const parsedResponse: IResponse<TResponse> = {
      result: this.tryParseStringtoJson(response.body),
      status: response.status,
    };

    return parsedResponse;
  }

  private responseIsAnError(response: popsicle.Response): boolean {
    return response.status < this.httpSuccessResponseCode || response.status >= this.httpRedirectResponseCode;
  }

  private createAndThrowError(response: popsicle.Response): void {
    const responseStatusCode = response.status;
    const errorName = EssentialProjectErrors.ErrorCodes[responseStatusCode];

    const errorInfo = this.tryParseStringtoJson<IErrorInfo | string>(response.body);

    if (typeof errorInfo === 'string') {
      this.throwErrorFromString(errorName, errorInfo as string);
    }

    this.throwErrorFromObject(errorName, errorInfo as IErrorInfo);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tryParseStringtoJson<TResult>(result: any): TResult {
    // NOTE: Every response.body received by popsicle is a string, even if "Content-Type application/json" is set, or no body was provided.
    try {
      return JSON.parse(result);
    } catch (error) {
      return result;
    }
  }

  private throwErrorFromString(errorName: string, message: string): void {
    throw this.isEssentialProjectsError(errorName)
      ? new EssentialProjectErrors[errorName](message)
      : new EssentialProjectErrors.InternalServerError(message);
  }

  private throwErrorFromObject(errorName: string, errorInfo: IErrorInfo): void {

    if (this.isEssentialProjectsError(errorName)) {
      this.throwEssentialProjectsError(errorName, errorInfo as IErrorInfo);
    }

    this.throwNonEssentialProjectsError(errorInfo as IErrorInfo);
  }

  private throwEssentialProjectsError(errorName: string, errorInfo: IErrorInfo): void {
    const essentialProjectsError = new EssentialProjectErrors[errorName](errorInfo.message);
    essentialProjectsError.additionalInformation = errorInfo.additionalInformation;

    throw essentialProjectsError;
  }

  private throwNonEssentialProjectsError(error: IErrorInfo): void {
    throw new Error(error.message);
  }

  private isEssentialProjectsError(errorName: string): boolean {
    return errorName in EssentialProjectErrors;
  }

}
