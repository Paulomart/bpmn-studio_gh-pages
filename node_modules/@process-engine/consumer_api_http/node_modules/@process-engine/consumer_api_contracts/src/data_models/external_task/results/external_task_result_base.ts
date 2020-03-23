/**
 * Base class for implementing an ExternalTaskApiResult.
 */
export abstract class ExternalTaskResultBase {

  public readonly externalTaskId: string;

  constructor(externalTaskId: string) {
    this.externalTaskId = externalTaskId;
  }

}
