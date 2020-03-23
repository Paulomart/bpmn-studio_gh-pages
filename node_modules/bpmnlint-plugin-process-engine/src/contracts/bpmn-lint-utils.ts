import {IModdleElement} from '@process-engine/bpmn-elements_contracts';

export interface BpmnLintUtils {
  /**
   * Checks if the given node is of the given type.
   *
   * @param {IModdleElement} node The node to check.
   * @param {string} type The type to check as a string.
   */
  is(node: IModdleElement, type: string): boolean;

  /**
   * Checks if the given node is of any of the given types.
   *
   * @param {IModdleElememt} node The node to check.
   * @param {string} types The types to check the node for.
   */
  isAny(node: IModdleElement, types: Array<string>): boolean;
}
