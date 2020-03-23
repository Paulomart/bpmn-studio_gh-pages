/**
 * Describes the payload that must be send with a finishExternalTask HTTP POST request.
 */
export class FinishExternalTaskRequestPayload<TResult> {

  public readonly workerId: string;
  public readonly result: TResult;

  constructor(workerId: string, result: TResult) {
    this.workerId = workerId;
    this.result = result;
  }

}
