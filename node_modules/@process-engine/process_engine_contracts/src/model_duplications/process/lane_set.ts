import {BaseElement} from '../flow_nodes/index';
import {Lane} from './lane';

/**
 * Describes a BPMN LaneSet; in essence a collection of lanes.
 */
export class LaneSet extends BaseElement {

  public lanes: Array<Lane> = [];

}
