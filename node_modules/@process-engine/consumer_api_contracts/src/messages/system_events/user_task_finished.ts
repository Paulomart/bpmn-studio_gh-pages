import {UserTaskResult} from '../../data_models/user_task/user_task_result';

import {BaseEventMessage} from '../base_event_message';

/**
 * The message sent when a UserTask has been finished.
 */
export class UserTaskFinishedMessage extends BaseEventMessage {

  /**
   * The result the UserTask was finished with.
   */
  public userTaskResult: UserTaskResult;

  constructor(
    userTaskResult: UserTaskResult,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    currentToken: any,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);

    this.userTaskResult = userTaskResult;
  }

}
