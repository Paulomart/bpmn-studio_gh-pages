import {IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a gateway has a mixed Split- and Join- purpose.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsNotAGateway: boolean = !(lintUtils.is(node, 'bpmn:ComplexGateway')
                                      || lintUtils.is(node, 'bpmn:EventBasedGateway')
                                      || lintUtils.is(node, 'bpmn:ExclusiveGateway')
                                      || lintUtils.is(node, 'bpmn:InclusiveGateway')
                                      || lintUtils.is(node, 'bpmn:ParallelGateway'));

    if (nodeIsNotAGateway) {
      return;
    }

    const nodeHasMultipleIncomingSequenceFlows: boolean = node.incoming.length > 1;
    const nodeHasMultipleOutgoingSequenceFlows: boolean = node.outgoing.length > 1;

    const gatewayIsMixed: boolean = nodeHasMultipleIncomingSequenceFlows && nodeHasMultipleOutgoingSequenceFlows;

    if (gatewayIsMixed) {
      reporter.report(node.id, 'Gateways with mixed Split- and Join- purpose are not allowed!');
    }
  }

  return {
    check: check,
  };
};
