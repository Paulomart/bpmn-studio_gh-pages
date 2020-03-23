import {IEventElement, IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the process contains a IntermediateCompensationThrowEvent.
 *
 * IntermediateCompensationThrowEvent are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsIntermediateThrowEvent: boolean = lintUtils.is(node, 'bpmn:IntermediateThrowEvent');
    if (nodeIsIntermediateThrowEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const intermediateEventHasEventDefinitions: boolean = eventElement.eventDefinitions !== undefined;
      if (intermediateEventHasEventDefinitions) {

        const intermediateEventIsCompensationEvent: boolean = eventElement.eventDefinitions.some((definition: IModdleElement) => {
          return lintUtils.is(definition, 'bpmn:CompensateEventDefinition');
        });

        if (intermediateEventIsCompensationEvent) {
          reporter.report(node.id, 'IntermediateCompensationThrowEvent are currently not supported!');
        }
      }

    }
  }

  return {
    check: check,
  };
};
