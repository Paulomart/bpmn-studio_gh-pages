import {IShape} from './IShape';

export interface IConnection extends IShape {
  source?: IShape;
  target?: IShape;
}
