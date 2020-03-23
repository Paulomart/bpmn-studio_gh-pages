import {IIdentity} from '@essential-projects/iam_contracts';

import {BaseSystemEventMessage} from './base_system_event_message';
import {BpmnType} from '../../../constants';

/**
 * The message sent when an Activity has been finished.
 */
export class ActivityFinishedMessage extends BaseSystemEventMessage {

  public flowNodeType: BpmnType;

  constructor(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    flowNodeType: BpmnType,
    processInstanceOwner: IIdentity,
    currentToken: any,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, processInstanceOwner, currentToken);

    this.flowNodeType = flowNodeType;
  }

}
