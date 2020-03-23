import {IEventDefinition} from './IEventDefinition';
import {IModdleElement} from './IModdleElement';

export interface IEventElement extends IModdleElement {
  eventDefinitions: Array<IEventDefinition>;
}
