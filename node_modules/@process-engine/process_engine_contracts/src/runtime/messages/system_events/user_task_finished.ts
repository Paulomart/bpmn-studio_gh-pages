import {IIdentity} from '@essential-projects/iam_contracts';

import {UserTaskResult} from '../../types/user_task_result';
import {BaseSystemEventMessage} from './base_system_event_message';

/**
 * The message sent when a user task has been finished.
 */
export class UserTaskFinishedMessage extends BaseSystemEventMessage {

  /**
   * The result the user task was finished with.
   */
  public userTaskResult: UserTaskResult;

  constructor(
    userTaskResult: UserTaskResult,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    processInstanceOwner: IIdentity,
    currentToken: any,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, processInstanceOwner, currentToken);

    this.userTaskResult = userTaskResult;
  }

}
