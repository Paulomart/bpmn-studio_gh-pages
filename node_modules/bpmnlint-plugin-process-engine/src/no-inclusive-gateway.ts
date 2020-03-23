import {IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the process contains a InclusiveGateway.
 *
 * InclusiveGateways are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsInclusiveGateway: boolean = lintUtils.is(node, 'bpmn:InclusiveGateway');
    if (nodeIsInclusiveGateway) {

      reporter.report(node.id, 'InclusiveGateways are currently not supported!');
    }
  }

  return {
    check: check,
  };
};
