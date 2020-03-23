import {Collaboration} from './collaboration';
import {Process} from './process';
import {Xmlns} from './xmlns';

/**
 * Contains the parsed ProcessModels, taken from a BPMN file.
 * This is the root object for the internal ProcessModel structure.
 */
export class Definitions {

  public xmlns: Xmlns;
  public id: string;
  public targetNamespace: string;
  public exporter: string;
  public exporterVersion: string;
  /**
   * Contains information about the Collaboration associated with this
   * ProcessDefiniton, such as the participants.
   */
  public collaboration: Collaboration;
  /**
   * Contains a list of all processes contained within this definition.
   */
  public processes: Array<Process> = [];

}
