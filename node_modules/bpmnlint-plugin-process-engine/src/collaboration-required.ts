import {IDefinitions, IModdleElement} from '@process-engine/bpmn-elements_contracts';

import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains no Collaboration.
 * It will report that the Process contains no Participant since it is impossible
 * to create a collaboration without creating a Participant.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {
    const nodeIsDefinitions: boolean = lintUtils.is(node, 'bpmn:Definitions');

    if (nodeIsDefinitions) {
      const definitions: IDefinitions = node as IDefinitions;

      const definitionsContainNoCollaboration: boolean = !definitions.rootElements.some((element: IModdleElement) => {
        return lintUtils.is(element, 'bpmn:Collaboration');
      });

      if (definitionsContainNoCollaboration) {
        const process: IModdleElement = definitions.rootElements.find((element: IModdleElement) => {
          return lintUtils.is(element, 'bpmn:Process');
        });

        reporter.report(process.id, 'This Process contains no Participant');
      }

    }

  }

  return {
    check: check,
  };
};
