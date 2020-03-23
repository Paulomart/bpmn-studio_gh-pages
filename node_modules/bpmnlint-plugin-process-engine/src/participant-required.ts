import {IDefinitions, IModdleElement} from '@process-engine/bpmn-elements_contracts';

import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains no Participant.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {
    const nodeIsDefinitions: boolean = lintUtils.is(node, 'bpmn:Definitions');

    if (nodeIsDefinitions) {
      const definitions: IDefinitions = node as IDefinitions;

      const collaboration: IModdleElement = definitions.rootElements.find((element: IModdleElement) => {
        return lintUtils.is(element, 'bpmn:Collaboration');
      });

      const collaborationIsUndefined: boolean = collaboration === undefined;
      if (collaborationIsUndefined) {
        return;
      }

      const collaborationContainsNoParticipant: boolean = collaboration.participants.length === 0;
      if (collaborationContainsNoParticipant) {
        const process: IModdleElement = definitions.rootElements.find((element: IModdleElement) => {
          return lintUtils.is(element, 'bpmn:Process');
        });

        reporter.report(process.id, 'This process contains no Participant');
      }
    }
  }

  return {
    check: check,
  };
};
