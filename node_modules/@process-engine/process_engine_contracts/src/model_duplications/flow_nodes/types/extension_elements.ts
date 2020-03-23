import {CamundaExecutionListener} from './camunda_execution_listener';
import {CamundaExtensionProperty} from './camunda_extension_property';

/**
 * This wraps all camunda specific properties and elements that can be
 * associated with any BPMN element.
 * For example, for ServiceTasks, these will store the properties
 * 'module', 'method' and 'params'.
 */
export class ExtensionElements {

  public camundaExecutionListener?: CamundaExecutionListener;
  public camundaExtensionProperties?: Array<CamundaExtensionProperty> = [];

}
