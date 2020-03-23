import {IModdleElement} from '@process-engine/bpmn-elements_contracts';

import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the given process has more than one participant.
 *
 * Multiple participants are currently not supported by the Process Engine.
 */
module.exports = (): any => {
  const maxParticipantCount: number = 1;
  let participantCount: number = 0;

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsParticipant: boolean = lintUtils.is(node, 'bpmn:Participant');
    if (nodeIsParticipant) {
      participantCount = participantCount + 1;

      const tooManyPaticipantsPresent: boolean = participantCount > maxParticipantCount;
      if (tooManyPaticipantsPresent) {
        reporter.report(node.id, 'It is not supported to use more than one participant');
      }

    }
  }

  return {
    check: check,
  };
};
