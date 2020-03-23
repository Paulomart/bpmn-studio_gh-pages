import {IForm} from './IForm';
import {IModdleElement} from './IModdleElement';

export interface IFormElement extends IModdleElement {
  fields?: Array<IForm>;
  formKey?: string;
}
