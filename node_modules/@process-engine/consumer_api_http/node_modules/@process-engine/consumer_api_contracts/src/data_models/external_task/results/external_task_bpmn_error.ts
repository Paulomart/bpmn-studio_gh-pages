import {ExternalTaskResultBase} from './external_task_result_base';

/**
 * Contains the result set for an ExternalTask that failed with a BpmnError.
 */
export class ExternalTaskBpmnError extends ExternalTaskResultBase {

  public readonly errorCode: string;
  public readonly errorMessage: string;

  constructor(externalTaskId: string, errorCode: string, errorMessage?: string) {
    super(externalTaskId);
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }

}
