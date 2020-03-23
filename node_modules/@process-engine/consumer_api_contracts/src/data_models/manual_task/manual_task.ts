/**
 * Describes a suspended ManualTask that is waiting to be finished.
 */
export class ManualTask {

  /**
   * The model ID of the ManualTask, as it is declared in the ProcessModel.
   */
  public id: string;
  /**
   * The name of the ManualTask, as it is declared in the ProcessModel.
   */
  public name: string;
  /**
   * The instance ID of the ManualTask.
   */
  public flowNodeInstanceId?: string;
  public correlationId: string;
  public processModelId: string;
  public processInstanceId?: string;
  /**
   * The token payload the ManualTask got suspended with.
   */
  public tokenPayload: any;

}
