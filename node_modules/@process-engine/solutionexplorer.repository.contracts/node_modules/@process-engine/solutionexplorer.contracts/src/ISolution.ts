import {IDiagram} from './IDiagram';

export interface ISolution {
  name: string;
  uri: string;
  diagrams: Array<IDiagram>;
}
