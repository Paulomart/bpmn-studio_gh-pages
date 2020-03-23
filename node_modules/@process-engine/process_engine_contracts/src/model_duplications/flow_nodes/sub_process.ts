import {BpmnType} from '../../constants';
import {LaneSet, SequenceFlow} from '../process/index';
import {FlowNode} from './flow_node';

/**
 * Describes a BPMN Subprocess.
 *
 * Technically they work like normal processes, except that they exist only
 * within another process and are treated like an activity for that process.
 */
export class SubProcess extends FlowNode {

  public get bpmnType(): BpmnType {
    return BpmnType.subProcess;
  }

  public laneSet?: LaneSet;
  public flowNodes: Array<FlowNode> = [];
  public sequenceFlows: Array<SequenceFlow> = [];

}
