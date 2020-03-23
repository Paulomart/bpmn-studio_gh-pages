import {IConditionalEventDefinition} from './IConditionalEventDefinition';
import {IEventElement} from './IEventElement';

export interface IConditionalEventElement extends IEventElement {
  eventDefinitions: Array<IConditionalEventDefinition>;
}
