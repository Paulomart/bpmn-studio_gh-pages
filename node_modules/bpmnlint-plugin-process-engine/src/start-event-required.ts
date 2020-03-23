import {IModdleElement} from '@process-engine/bpmn-elements_contracts';

import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process has no StartEvent.
 */
module.exports = (): any => {

  function hasNoStartEvent(node: IModdleElement): boolean {
    const flowElements: Array<IModdleElement> = node.processRef.flowElements || [];

    const startEventPresent: boolean = flowElements.some((element: IModdleElement) => {
      return lintUtils.is(element, 'bpmn:StartEvent');
    });

    return !startEventPresent;
  }

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {
    const nodeIsParticipant: boolean = lintUtils.is(node, 'bpmn:Participant');

    if (nodeIsParticipant) {
      const participantHasNoStartEvent: boolean = hasNoStartEvent(node);

      if (participantHasNoStartEvent) {

        reporter.report(node.id, 'This process has no StartEvent');
      }

    }
  }

  return {
    check: check,
  };
};
