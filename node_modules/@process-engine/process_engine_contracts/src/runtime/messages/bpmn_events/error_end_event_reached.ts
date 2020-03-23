import {IIdentity} from '@essential-projects/iam_contracts';

import {BaseBpmnEventMessage} from './base_bpmn_event_message';

/**
 * Encapsulates a Message for the EventAggregator, describing an ErrorEndEvent.
 */
export class ErrorEndEventReachedMessage extends BaseBpmnEventMessage {

  public readonly error: Error;

  constructor(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    processInstanceOwner: IIdentity,
    currentToken: any,
    error: Error,
    endEventName?: string,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, processInstanceOwner, currentToken, endEventName);
    this.error = error;
  }

}
