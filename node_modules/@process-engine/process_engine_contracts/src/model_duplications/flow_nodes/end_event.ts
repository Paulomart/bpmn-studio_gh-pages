import {BpmnType, EventType} from '../../constants';
import {FlowNode} from './flow_node';

import {
  ErrorEventDefinition,
  MessageEventDefinition,
  SignalEventDefinition,
  TerminateEventDefinition,
} from './definitions/index';

/**
 * Describes a BPMN EndEvent.
 * These are used to finish a process.
 *
 * Depending on the type of EndEvent used, the process will either be finished
 * with a success message or an error.
 */
export class EndEvent extends FlowNode {

  public get bpmnType(): BpmnType {
    return BpmnType.endEvent;
  }

  public get eventType(): EventType {
    const eventIsErrorEvent: boolean = this.errorEventDefinition !== undefined;
    if (eventIsErrorEvent) {

      return EventType.errorEvent;
    }

    const eventIsMessageEvent: boolean = this.messageEventDefinition !== undefined;
    if (eventIsMessageEvent) {

      return EventType.messageEvent;
    }

    const eventIsSignalEvent: boolean = this.signalEventDefinition !== undefined;
    if (eventIsSignalEvent) {

      return EventType.signalEvent;
    }

    const eventIsTerminateEvent: boolean = this.terminateEventDefinition !== undefined;
    if (eventIsTerminateEvent) {

      return EventType.terminateEvent;
    }

    return undefined;
  }

  public errorEventDefinition?: ErrorEventDefinition;
  public messageEventDefinition?: MessageEventDefinition;
  public signalEventDefinition?: SignalEventDefinition;
  public terminateEventDefinition?: TerminateEventDefinition;
  /**
   * When using a SignalEndEvent or MessageEndEvent, this property can hold a
   * definition for a payload to send with the event.
   *
   * Use this, if you do not want to use the current ProcessToken as event
   * payload.
   */
  public inputValues?: any;

}
