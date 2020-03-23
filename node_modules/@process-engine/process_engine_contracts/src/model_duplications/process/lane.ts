import {BaseElement} from '../flow_nodes/index';
import {LaneSet} from './lane_set';

/**
 * Describes a BPMN Lane.
 * Note that the lane itself contains only the references to its FlowNodes.
 * The FlowNodes themselves are stored directly in the ProcessModel.
 * This reflects the original XML structure as defined by the BPMN specs.
 */
export class Lane extends BaseElement {

  public name: string;
  public flowNodeReferences: Array<string> = [];
  public childLaneSet?: LaneSet;

}
