import {IEventDefinition} from './IEventDefinition';
import {ISignal} from './ISignal';

export interface ISignalEventDefinition extends IEventDefinition {
  signalRef?: ISignal;
}
