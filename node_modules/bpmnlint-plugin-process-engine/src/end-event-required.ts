import {IModdleElement} from '@process-engine/bpmn-elements_contracts';

import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process has no EndEvent.
 */
module.exports = (): any => {

  function hasNoEndEvent(node: IModdleElement): boolean {
    const flowElements: Array<IModdleElement> = node.processRef.flowElements || [];

    const endEventPresent: boolean = flowElements.some((element: IModdleElement) => {
      return lintUtils.is(element, 'bpmn:EndEvent');
    });

    return !endEventPresent;
  }

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {
    const nodeIsParticipant: boolean = lintUtils.is(node, 'bpmn:Participant');

    if (nodeIsParticipant) {
      const participantHasNoEndEvent: boolean = hasNoEndEvent(node);

      if (participantHasNoEndEvent) {

        reporter.report(node.id, 'This process has no EndEvent');
      }

    }
  }

  return {
    check: check,
  };
};
