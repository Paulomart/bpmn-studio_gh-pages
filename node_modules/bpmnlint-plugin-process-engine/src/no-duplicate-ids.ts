import {IModdleElement} from '@process-engine/bpmn-elements_contracts';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process has two or more FlowNodes with the same ID.
 */
module.exports = (): any => {

  const existingIds: Array<string> = [];

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeHasNoId: boolean = node.id === undefined;
    if (nodeHasNoId) {
      return;
    }

    const nodeIsFormField: boolean = node.$type === 'camunda:FormField';
    if (nodeIsFormField) {
      return;
    }

    const idAlreadyExists: boolean = existingIds.includes(node.id);

    if (idAlreadyExists) {
      reporter.report(node.id, 'ID already exists!');
    }

    existingIds.push(node.id);
  }

  return {
    check: check,
  };
};
