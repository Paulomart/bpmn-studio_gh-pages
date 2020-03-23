import {IEventElement, IModdleElement, ISignalEventDefinition, ISignalEventElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains an undefined Signal Event.
 *
 * Signal Events always need an event definition.
 */
module.exports = (): any => {

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsEvent: boolean = lintUtils.is(node, 'bpmn:BoundaryEvent')
                              || lintUtils.is(node, 'bpmn:EndEvent')
                              || lintUtils.is(node, 'bpmn:StartEvent')
                              || lintUtils.is(node, 'bpmn:IntermediateThrowEvent')
                              || lintUtils.is(node, 'bpmn:IntermediateCatchEvent');

    if (nodeIsEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const eventContainsNoDefinitions: boolean = eventElement.eventDefinitions === undefined;

      if (eventContainsNoDefinitions) {

        return;
      }

      const nodeIsSignalEvent: boolean = eventElement.eventDefinitions.some((eventDefinition: IModdleElement) => {
        return lintUtils.is(eventDefinition, 'bpmn:SignalEventDefinition');
      });

      if (nodeIsSignalEvent) {
        const signalEventElement: ISignalEventElement = eventElement as ISignalEventElement;

        const signalEventDefinition: ISignalEventDefinition = signalEventElement.eventDefinitions.find((eventDefinition: ISignalEventDefinition) => {
          return lintUtils.is(eventDefinition, 'bpmn:SignalEventDefinition');
        });

        const signalRefIsUndefined: boolean = signalEventDefinition.signalRef === undefined
                                           || signalEventDefinition.signalRef === null;
        if (signalRefIsUndefined) {
          reporter.report(node.id, 'This Signal Event is not defined.');
        }
      }
    }

  }

  return {
    check: check,
  };
};
