import {BpmnType} from '../../constants';
import {BaseElement} from './base_element';

/**
 * Base class for all FlowNodes.
 * These include Events, Gateways and Activities.
 */
export abstract class FlowNode extends BaseElement {

  public name: string;
  public incoming: Array<string> = [];
  public outgoing: Array<string> = [];
  public defaultOutgoingSequenceFlowId?: string;
  public abstract readonly bpmnType: BpmnType;

}
