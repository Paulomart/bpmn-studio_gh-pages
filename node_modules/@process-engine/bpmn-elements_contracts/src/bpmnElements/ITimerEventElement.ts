import {IEventElement} from './IEventElement';
import {ITimerEventDefinition} from './ITimerEventDefinition';

export interface ITimerEventElement extends IEventElement {
  eventDefinitions: Array<ITimerEventDefinition>;
}
