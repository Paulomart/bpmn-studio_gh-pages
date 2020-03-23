import {IModdleElement} from './IModdleElement';

export interface IDefinitions extends IModdleElement {
  rootElements: Array<IModdleElement>;
}
