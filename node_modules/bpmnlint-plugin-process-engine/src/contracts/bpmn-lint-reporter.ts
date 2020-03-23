import {IModdleElement} from '@process-engine/bpmn-elements_contracts';

export interface BpmnLintReporter {
  /**
   * Reports a linting error.
   *
   * @param nodeID The id of the node the linting failed on.
   * @param message The message of why the linting failed.
   */
  report(nodeId: string, message: string): void;
}
