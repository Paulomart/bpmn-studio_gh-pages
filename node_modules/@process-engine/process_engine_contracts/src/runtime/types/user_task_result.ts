/**
 * Describes the payload that can be given to a user task upon finishing it.
 */
export class UserTaskResult {

  /**
   * Contains a list of results for the user tasks form fields.
   */
  public formFields: {
    [fieldId: string]: any;
  };

}
