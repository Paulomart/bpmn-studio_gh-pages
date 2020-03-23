import {BaseEventMessage} from '../base_event_message';
import {BpmnType} from '../../data_models/bpmn_type';

/**
 * The message sent when an Activity has been reached.
 */
export class ActivityReachedMessage extends BaseEventMessage {

  public flowNodeType: BpmnType;

  constructor(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    flowNodeType: BpmnType,
    currentToken: any,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);

    this.flowNodeType = flowNodeType;
  }

}
