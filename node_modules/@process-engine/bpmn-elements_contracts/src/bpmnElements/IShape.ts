import {IConnection} from './IConnection';
import {IDocumentation, IModdleElement} from './index';

export interface IShape {
  name?: string;
  attrs?: IModdleElement;
  businessObject: IModdleElement;
  id: string;
  type: string;
  label: IShape;
  x: number;
  y: number;
  width: number;
  height: number;
  documentation?: Array<IDocumentation>;
  $type: string;
  target?: IShape;
  source?: IShape;
  outgoing?: Array<IConnection>;
}
