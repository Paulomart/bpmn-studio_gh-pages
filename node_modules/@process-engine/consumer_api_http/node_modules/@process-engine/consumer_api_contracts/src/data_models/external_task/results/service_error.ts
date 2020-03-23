/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This type can be used to throw a Service error from an ExternalServiceTaskHandler.
 */
export class ServiceError {

  public readonly name: string;
  public readonly code: number | string;
  public readonly message: string;
  public readonly additionalInformation: any;

  constructor(name: string, code?: number | string, message?: string, details?: any) {
    this.name = name;
    this.code = code ?? '';
    this.message = message ?? '';
    this.additionalInformation = details;
  }

}
