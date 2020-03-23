import {IErrorEventDefinition} from './IErrorEventDefinition';
import {IEventElement} from './IEventElement';

export interface IErrorEventElement extends IEventElement {
  eventDefinitions: Array<IErrorEventDefinition>;
}
