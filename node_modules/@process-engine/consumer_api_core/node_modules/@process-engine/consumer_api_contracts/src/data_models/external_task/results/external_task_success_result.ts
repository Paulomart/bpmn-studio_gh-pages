import {ExternalTaskResultBase} from './external_task_result_base';

/**
 * Contains the result set for an ExternalTask that finished successfully.
 * The result must be a valid JSON or any other valid object type.
 */
export class ExternalTaskSuccessResult<TResult extends object> extends ExternalTaskResultBase {

  public readonly result: TResult;

  constructor(externalTaskId: string, result: TResult) {
    super(externalTaskId);
    this.result = result;
  }

}
