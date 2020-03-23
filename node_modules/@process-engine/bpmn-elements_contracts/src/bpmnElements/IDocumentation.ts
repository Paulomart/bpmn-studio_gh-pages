import {IModdleElement} from './IModdleElement';

export interface IDocumentation extends IModdleElement {
  $type: string;
  text?: string;
}
