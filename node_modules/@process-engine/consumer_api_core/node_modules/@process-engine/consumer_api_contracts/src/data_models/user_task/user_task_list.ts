import {UserTask} from './user_task';

/**
 * Describes a list of UserTasks.
 */
export class UserTaskList {

  public userTasks: Array<UserTask> = [];
  public totalCount: number;

}
