import {IDocumentation} from './IDocumentation';

export interface IEscalation {
  $type: string;
  documentation: Array<IDocumentation>;
  id: string;
  name: string;
  escalationCode?: string;
}
