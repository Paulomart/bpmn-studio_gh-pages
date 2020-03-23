import {IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the process contains a complex Gateway.
 *
 * Complex Gateways are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsComplexGateway: boolean = lintUtils.is(node, 'bpmn:ComplexGateway');
    if (nodeIsComplexGateway) {

      reporter.report(node.id, 'Complex Gateways are currently not supported!');
    }
  }

  return {
    check: check,
  };
};
