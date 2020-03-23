import {IEventElement, IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if the process contains a ConditionalStartEvent.
 *
 * ConditionalStartEvents are currently not supported by the ProcessEngine.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsStartEvent: boolean = lintUtils.is(node, 'bpmn:StartEvent');
    if (nodeIsStartEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const startEventHasEventDefinitions: boolean = eventElement.eventDefinitions !== undefined;
      if (startEventHasEventDefinitions) {

        const startEventIsConditional: boolean = eventElement.eventDefinitions.some((definition: IModdleElement) => {
          return lintUtils.is(definition, 'bpmn:ConditionalEventDefinition');
        });

        if (startEventIsConditional) {
          reporter.report(node.id, 'ConditionalStartEvents are currently not supported!');
        }
      }

    }
  }

  return {
    check: check,
  };
};
