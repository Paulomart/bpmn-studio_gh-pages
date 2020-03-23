import {BaseElement} from '../flow_nodes/index';
import {Participant} from './participant';

/**
 * Contains information about the BPMN collaboration, such as the name of the
 * collaboration and a list of participants.
 */
export class Collaboration extends BaseElement {

  public name: string;
  public participants: Array<Participant> = [];

}
