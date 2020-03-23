import {IIdentity} from '@essential-projects/iam_contracts';

import {BaseBpmnEventMessage} from './base_bpmn_event_message';

/**
 * Encapsulates a Message for the EventAggregator, describing a
 * MessageEvent.
 */
export class MessageEventReachedMessage extends BaseBpmnEventMessage {

  public messageReference: string;

  constructor(
    messageReference: string,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    processInstanceOwner: IIdentity,
    currentToken: any,
    messageEventName?: string,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, processInstanceOwner, currentToken, messageEventName);

    this.messageReference = messageReference;
  }

}
