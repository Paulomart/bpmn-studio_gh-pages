import {EventDefinition} from './event_definition';

/**
 * Contains the definition for a LinkEvent.
 */
export class LinkEventDefinition extends EventDefinition {

  public readonly name: string;

  constructor(linkName: string) {
    super();
    this.name = linkName;
  }

}
