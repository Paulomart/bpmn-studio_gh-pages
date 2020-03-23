import {UserTaskConfig} from './user_task_config';

/**
 * Describes a suspended UserTask that is waiting to be finished.
 */
export class UserTask {

  /**
   * The model ID of the UserTask, as it is declared in the ProcessModel.
   */
  public id: string;
  /**
   * The name of the UserTask, as it is declared in the ProcessModel.
   */
  public name: string;
  /**
   * The instance ID of the UserTask.
   */
  public flowNodeInstanceId?: string;
  public correlationId: string;
  public processModelId: string;
  public processInstanceId?: string;
  /**
   * Contains information about the UserTasks configuration,
   * such as the FormFields that can be accessed.
   */
  public data: UserTaskConfig;
  /**
   * The token payload the UserTask got suspended with.
   */
  public tokenPayload: any;

}
