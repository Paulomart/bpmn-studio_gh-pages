import {
  LinkEventDefinition,
  MessageEventDefinition,
  SignalEventDefinition,
  TimerEventDefinition,
} from './definitions/index';

import {BpmnType, EventType} from '../../constants';
import {FlowNode} from './flow_node';

/**
 * Describes a BPMN IntermediateThrowEvent.
 *
 * These are used to wait for events during ProcessModel execution.
 *
 * The only exception is the IntermediateTimerCatchEvent, which is used to halt
 * the execution for a given amount of time.
 */
export class IntermediateCatchEvent extends FlowNode {

  public get bpmnType(): BpmnType {
    return BpmnType.intermediateCatchEvent;
  }

  public get eventType(): EventType {
    const eventIsMessageEvent: boolean = this.messageEventDefinition !== undefined;
    if (eventIsMessageEvent) {
      return EventType.messageEvent;
    }

    const eventIsSignalEvent: boolean = this.signalEventDefinition !== undefined;
    if (eventIsSignalEvent) {
      return EventType.signalEvent;
    }

    const eventIsTimerEvent: boolean = this.timerEventDefinition !== undefined;
    if (eventIsTimerEvent) {
      return EventType.timerEvent;
    }

    const eventIsLinkEvent: boolean = this.linkEventDefinition !== undefined;
    if (eventIsLinkEvent) {
      return EventType.linkEvent;
    }

    return undefined;
  }

  /**
   * When using an IntermediateLinkCatchEvent, this will contain the link by
   * which to access this event.
   */
  public linkEventDefinition?: LinkEventDefinition;

  /**
   * When using an IntermediateMessageCatchEvent, this will contain the message
   * to wait for.
   */
  public messageEventDefinition?: MessageEventDefinition;

  /**
   * When using an IntermediateSignalCatchEvent, this will contain the signal
   * to wait for.
   */
  public signalEventDefinition?: SignalEventDefinition;

  /**
   * When using an IntermediateTimerCatchEvent, this will contain the definiton
   * of the timer that is used to pause the execution.
   */
  public timerEventDefinition?: TimerEventDefinition;

}
