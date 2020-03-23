import {IEventElement} from './IEventElement';
import {ISignalEventDefinition} from './ISignalEventDefinition';

export interface ISignalEventElement extends IEventElement {
  eventDefinitions: Array<ISignalEventDefinition>;
}
