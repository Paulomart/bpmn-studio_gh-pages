import {IError} from './IError';
import {IEventDefinition} from './IEventDefinition';

export interface IErrorEventDefinition extends IEventDefinition {
  errorRef?: IError;
  errorMessageVariable?: string;
}
