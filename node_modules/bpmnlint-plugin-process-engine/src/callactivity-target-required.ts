import {ICallActivityElement, IDefinitions, IModdleElement} from '@process-engine/bpmn-elements_contracts';

import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that checks, if a CallActivity contains a target.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {
    const currentNodeIsCallActivity: boolean = lintUtils.is(node, 'bpmn:CallActivity');

    if (currentNodeIsCallActivity) {
      const currentCallActivity: ICallActivityElement = node as ICallActivityElement;
      const calledElementNotAssigned: boolean = currentCallActivity.calledElement === undefined
                                                || currentCallActivity.calledElement === null;

      if (calledElementNotAssigned) {
        reporter.report(currentCallActivity.id, 'No called element assigned');
      }
    }
  }

  return {
    check: check,
  };
};
