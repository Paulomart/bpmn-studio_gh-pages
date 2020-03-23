/**
 * Contains a message about a failed ExternalTask.
 */
export class ExternalTaskErrorMessage<TError extends Error = Error> {

  public readonly error: TError;

  constructor(error: TError) {
    this.error = error;
  }

}
