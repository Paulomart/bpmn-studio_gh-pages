import {IFormElement} from './IFormElement';
import {IModdleElement, IProperty} from './index';

export interface IPropertiesElement extends IModdleElement {
  values?: Array<IProperty>;
  fields?: Array<IFormElement>;
}
