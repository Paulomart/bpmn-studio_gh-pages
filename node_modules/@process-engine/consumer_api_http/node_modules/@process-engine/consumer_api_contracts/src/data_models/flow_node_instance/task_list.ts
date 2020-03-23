import {UserTask} from '../user_task/index';
import {ManualTask} from '../manual_task/index';
import {EmptyActivity} from '../empty_activity/index';

/**
 * Describes a list of Tasks.
 */
export class TaskList {

  public tasks: Array<EmptyActivity | ManualTask | UserTask> = [];
  public totalCount: number;

}
