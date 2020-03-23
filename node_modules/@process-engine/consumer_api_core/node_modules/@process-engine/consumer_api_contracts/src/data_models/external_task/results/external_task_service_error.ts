/* eslint-disable @typescript-eslint/no-explicit-any */
import {ExternalTaskResultBase} from './external_task_result_base';

/**
 * Contains the result set for an ExternalTask that failed with a service error.
 */
export class ExternalTaskServiceError extends ExternalTaskResultBase {

  public readonly errorCode: string;
  public readonly errorMessage: string;
  public readonly errorDetails: any;

  constructor(externalTaskId: string, errorMessage: string, errorDetails: any, errorCode?: string) {
    super(externalTaskId);
    this.errorMessage = errorMessage;
    this.errorDetails = errorDetails;
    this.errorCode = errorCode;
  }

}
