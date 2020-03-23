import {IErrorEventDefinition, IErrorEventElement, IEventElement, IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains an undefined Error Event.
 *
 * Error Events always need an event definition.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsEvent: boolean = lintUtils.is(node, 'bpmn:BoundaryEvent')
                              || lintUtils.is(node, 'bpmn:EndEvent');

    if (nodeIsEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const eventContainsNoDefinitions: boolean = eventElement.eventDefinitions === undefined;

      if (eventContainsNoDefinitions) {

        return;
      }

      const nodeIsErrorEvent: boolean = eventElement.eventDefinitions.some((eventDefinition: IModdleElement) => {
        return lintUtils.is(eventDefinition, 'bpmn:ErrorEventDefinition');
      });

      if (nodeIsErrorEvent) {
        const errorEventElement: IErrorEventElement = eventElement as IErrorEventElement;

        const errorEventDefinition: IErrorEventDefinition = errorEventElement.eventDefinitions.find((eventDefinition: IModdleElement) => {
          return lintUtils.is(eventDefinition, 'bpmn:ErrorEventDefinition');
        });

        const errorRefIsUndefined: boolean = errorEventDefinition.errorRef === undefined
                                          || errorEventDefinition.errorRef === null;
        if (errorRefIsUndefined) {
          reporter.report(node.id, 'This Error Event is not defined.');
        }
      }
    }

  }

  return {
    check: check,
  };
};
