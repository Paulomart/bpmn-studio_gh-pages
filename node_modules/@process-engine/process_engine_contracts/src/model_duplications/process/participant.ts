import {BaseElement} from '../flow_nodes/index';

/**
 * Describes a BPMN Participant of a Collaboration.
 */
export class Participant extends BaseElement {

  public name: string;
  public processReference: IProcessReference;

}

/**
 * Encapsulates the ID of a process.
 * This field is used with Participants, to associate the Participant
 * with its ProcessModels.
 */
export interface IProcessReference {
  processId: string;
}
