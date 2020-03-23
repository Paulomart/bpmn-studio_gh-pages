import {BpmnType, EventType} from '../../constants';
import {FlowNode} from './flow_node';

import {
  MessageEventDefinition,
  SignalEventDefinition,
  TimerEventDefinition,
} from './definitions/index';

/**
 * Describes a BPMN StartEvent.
 */
export class StartEvent extends FlowNode {

  public get bpmnType(): BpmnType {
    return BpmnType.startEvent;
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

    return undefined;
  }

  public messageEventDefinition?: MessageEventDefinition;
  public timerEventDefinition?: TimerEventDefinition;
  public signalEventDefinition?: SignalEventDefinition;

}
