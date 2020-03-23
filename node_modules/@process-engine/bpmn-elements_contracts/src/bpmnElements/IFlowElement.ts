import {IModdleElement} from './IModdleElement';

export interface IFlowElement extends IModdleElement {
  targetRef?: IModdleElement;
  sourceRef?: IModdleElement;
  default?: IModdleElement;
}
