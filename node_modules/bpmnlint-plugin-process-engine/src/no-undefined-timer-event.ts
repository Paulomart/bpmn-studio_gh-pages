import {IEventDefinition, IEventElement, IModdleElement, ITimerEventDefinition, ITimerEventElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains an undefined Timer Event.
 *
 * Timer Events always need an event definition.
 */
module.exports = (): any => {

  // tslint:disable:cyclomatic-complexity
  function check(node: IModdleElement, reporter: BpmnLintReporter): void {

    const nodeIsEvent: boolean = lintUtils.is(node, 'bpmn:BoundaryEvent')
                              || lintUtils.is(node, 'bpmn:StartEvent')
                              || lintUtils.is(node, 'bpmn:IntermediateCatchEvent');

    if (nodeIsEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const eventContainsNoDefinitions: boolean = eventElement.eventDefinitions === undefined;

      if (eventContainsNoDefinitions) {

        return;
      }

      const nodeIsTimerEvent: boolean = eventElement.eventDefinitions.some((eventDefinition: IModdleElement) => {
        return lintUtils.is(eventDefinition, 'bpmn:TimerEventDefinition');
      });

      if (nodeIsTimerEvent) {
        const timerEventElement: ITimerEventElement = eventElement as ITimerEventElement;

        const timerEventDefinition: ITimerEventDefinition = timerEventElement.eventDefinitions.find((eventDefinition: ITimerEventDefinition) => {
          return lintUtils.is(eventDefinition, 'bpmn:TimerEventDefinition');
        });

        const timerRefIsUndefined: boolean = timerEventDefinition.timeDuration === undefined
                                          && timerEventDefinition.timeDate === undefined
                                          && timerEventDefinition.timeCycle === undefined;
        if (timerRefIsUndefined) {
          reporter.report(node.id, 'This Timer Event is not defined.');
        }
      }
    }

  }

  return {
    check: check,
  };
};
