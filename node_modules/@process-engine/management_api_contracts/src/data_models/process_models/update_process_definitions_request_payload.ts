/**
 * Contains the payload that has to be provided with an updateProcessModel request.
 */
export class UpdateProcessDefinitionsRequestPayload {

  /**
   * The xml code with which to update the ProcessModel.
   */
  public xml: string;
  /**
   * If set to true, the import will overwrite existing ProcessModels with the same name.
   * If set to false, attempting to overwrite an already existing ProcessModel will cause an error.
   * If not set, 'false' is used as a default value.
   */
  public overwriteExisting?: boolean;

}
