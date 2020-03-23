/**
 * Contains a message about a successfully finished ExternalTask.
 */
export class ExternalTaskSuccessMessage<TResult> {

  public readonly result: TResult;

  constructor(result: TResult) {
    this.result = result;
  }

}
