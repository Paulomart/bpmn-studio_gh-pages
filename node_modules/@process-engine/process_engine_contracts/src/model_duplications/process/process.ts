import {BaseElement, FlowNode} from '../flow_nodes/index';
import {LaneSet} from './lane_set';
import {SequenceFlow} from './sequence_flow';

/**
 * Describes a BPMN Process.
 * Any and all information about FlowNodes, SequenceFlows and Lanes is
 * stored here.
 * This is the root element for working with ProcessModels.
 */
export class Process extends BaseElement {

  public name: string;
  public isExecutable: boolean;
  public laneSet?: LaneSet;
  public flowNodes: Array<FlowNode> = [];
  public sequenceFlows: Array<SequenceFlow> = [];

}
