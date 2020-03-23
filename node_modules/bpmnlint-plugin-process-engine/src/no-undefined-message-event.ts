import {IEventElement, IMessageEventDefinition, IMessageEventElement, IModdleElement} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';

import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule that reports if a process contains an undefined Message Event.
 *
 * Message Events always need an event definition.
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

      const nodeIsMessageEvent: boolean = eventElement.eventDefinitions.some((eventDefinition: IModdleElement) => {
        return lintUtils.is(eventDefinition, 'bpmn:MessageEventDefinition');
      });

      if (nodeIsMessageEvent) {
        const messageEventElement: IMessageEventElement = eventElement as IMessageEventElement;

        const messageEventDefinition: IMessageEventDefinition =
          messageEventElement.eventDefinitions.find((eventDefinition: IMessageEventDefinition) => {
            return lintUtils.is(eventDefinition, 'bpmn:MessageEventDefinition');
          });

        const messageRefIsUndefined: boolean = messageEventDefinition.messageRef === undefined
                                            || messageEventDefinition.messageRef === null;
        if (messageRefIsUndefined) {
          reporter.report(node.id, 'This Message Event is not defined.');
        }
      }
    }

  }

  return {
    check: check,
  };
};
