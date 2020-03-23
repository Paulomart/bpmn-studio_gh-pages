import {IEscalation} from './IEscalation';
import {IEventDefinition} from './IEventDefinition';

export interface IEscalationEventDefinition extends IEventDefinition {
  escalationRef?: IEscalation;
  escalationCodeVariable?: string;
}
