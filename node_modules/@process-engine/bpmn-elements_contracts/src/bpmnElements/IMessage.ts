import {IDocumentation} from './IDocumentation';
import {IModdleElement} from './IModdleElement';

export interface IMessage {
  $type: string;
  $parent?: IModdleElement;
  id: string;
  name: string;
  documentation: Array<IDocumentation>;
}
