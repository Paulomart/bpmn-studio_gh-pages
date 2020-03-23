import {EventDefinition} from './event_definition';

/**
 * Contains the definition for an ErrorEvent.
 */
export class ErrorEventDefinition extends EventDefinition {

  public name?: string;
  public code?: string;
  public message?: string;

}
