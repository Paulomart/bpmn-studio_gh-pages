/**
 * Describes the payload that must be send with a handleServiceError HTTP POST request.
 */
export class HandleServiceErrorRequestPayload {

  public readonly workerId: string;
  public readonly errorDetails: string;
  public readonly errorMessage: string;
  public readonly errorCode: string;

  constructor(workerId: string, errorMessage: string, errorDetails: string, errorCode: string) {
    this.workerId = workerId;
    this.errorMessage = errorMessage;
    this.errorDetails = errorDetails;
    this.errorCode = errorCode;
  }

}
