import {IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the process contains a BusinessRuleTask.
 *
 * BusinessRuleTask are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsBusinessRuleTask: boolean = lintUtils.is(node, 'bpmn:BusinessRuleTask');
    if (nodeIsBusinessRuleTask) {

      reporter.report(node.id, 'BusinessRuleTasks are currently not supported!');
    }
  }

  return {
    check: check,
  };
};
