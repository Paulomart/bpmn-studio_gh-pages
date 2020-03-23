import {IEventElement, IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the process contains a EscalationBoundaryEvent.
 *
 * EscalationBoundaryEvents are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsBoundaryEvent: boolean = lintUtils.is(node, 'bpmn:BoundaryEvent');
    if (nodeIsBoundaryEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const boundaryEventHasEventDefinitions: boolean = eventElement.eventDefinitions !== undefined;
      if (boundaryEventHasEventDefinitions) {

        const boundaryEventIsEscalationEvent: boolean = eventElement.eventDefinitions.some((definition: IModdleElement) => {
          return lintUtils.is(definition, 'bpmn:EscalationEventDefinition');
        });

        if (boundaryEventIsEscalationEvent) {
          reporter.report(node.id, 'EscalationBoundaryEvents are currently not supported!');
        }
      }

    }
  }

  return {
    check: check,
  };
};
