import {IEventElement, IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains an EscalationEndEvent.
 *
 * EscalationEndEvents are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsEndEvent: boolean = lintUtils.is(node, 'bpmn:EndEvent');
    if (nodeIsEndEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const endEventHasEventDefinitions: boolean = eventElement.eventDefinitions !== undefined;
      if (endEventHasEventDefinitions) {

        const endEventIsEscalationEndEvent: boolean = eventElement.eventDefinitions.some((definition: IModdleElement) => {
          return lintUtils.is(definition, 'bpmn:EscalationEventDefinition');
        });

        if (endEventIsEscalationEndEvent) {
          reporter.report(node.id, 'EscalationEndEvents are currently not supported!');
        }
      }

    }
  }

  return {
    check: check,
  };
};
