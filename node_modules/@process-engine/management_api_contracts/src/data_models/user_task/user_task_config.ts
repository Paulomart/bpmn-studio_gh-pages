import {UserTaskFormField} from './user_task_form_field';

/**
 * Contains information about a UserTasks configuration.
 */
export class UserTaskConfig {

  /**
   * A list of accessible FormFields for the UserTask.
   */
  public formFields: Array<UserTaskFormField> = [];
  /**
   * The perferred type of control for the FormField.
   */
  public preferredControl?: string;
  public description?: string;
  public finishedMessage?: string;

}
