import {IEventElement, IModdleElement, ITimerEventDefinition} from '@process-engine/bpmn-elements_contracts';
import * as lintUtils from 'bpmnlint-utils';
import {BpmnLintReporter} from './contracts/bpmn-lint-reporter';

/**
 * Rule which reports, if a defined TimerEvent contains an invalid
 * TimerEventDefinition.
 *
 * The TimerEventDefinition has to be in the ISO8601 Syntax.
 */
module.exports = (): any => {

  const handledEventList: Array<string> = [
    'bpmn:StartEvent',
    'bpmn:IntermediateCatchEvent',
    'bpmn:BoundaryEvent',
  ];

  function checkEmptyDefinition(timerDefinitionValue: string | undefined): boolean {
    const definitionNotGiven: boolean = timerDefinitionValue === undefined;

    if (definitionNotGiven) {

      return true;
    }

    const isDefinitionEmpty: boolean = timerDefinitionValue.trim() === '';

    return isDefinitionEmpty;
  }

  function validateTimerEventDefinition(
    timerEventDefinition: ITimerEventDefinition,
    rootNodeId: string,
    rootNodeIsStartEvent: boolean,
    reporter: BpmnLintReporter,
  ): void {
    const timerIsDate: boolean = timerEventDefinition.timeDate !== undefined;
    const timerIsDuration: boolean = timerEventDefinition.timeDuration !== undefined;
    const timerIsCycle: boolean = timerEventDefinition.timeCycle !== undefined;

    if (timerIsDate) {
      const timerDefinitionValue: string = timerEventDefinition.timeDate.body;
      const valueIsEmpty: boolean = checkEmptyDefinition(timerDefinitionValue);

      if (valueIsEmpty) {
        reporter.report(rootNodeId, 'Date is empty.');

        return;
      }

      /**
       * Found on: https://stackoverflow.com/a/14322189
       */
      /*tslint:disable-next-line:max-line-length*/
      const iso8601DateRegex: RegExp = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
      const dateIsInvalid: boolean = !iso8601DateRegex.test(timerDefinitionValue);

      if (dateIsInvalid) {
        reporter.report(rootNodeId, 'Date is not in ISO8601 Syntax.');
      }

    } else if (timerIsDuration) {
      const timerDefinitionValue: string = timerEventDefinition.timeDuration.body;
      const valueIsEmpty: boolean = checkEmptyDefinition(timerDefinitionValue);

      if (valueIsEmpty) {
        reporter.report(rootNodeId, 'Duration is empty.');

        return;
      }

      /**
       * Found on: https://stackoverflow.com/a/32045167
       */
      /*tslint:disable-next-line:max-line-length*/
      const durationRegex: RegExp = /^P(?!$)(\d+(?:\.\d+)?Y)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?W)?(\d+(?:\.\d+)?D)?(T(?=\d)(\d+(?:\.\d+)?H)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?S)?)?$/gm;
      const durationIsInvalid: boolean = !durationRegex.test(timerEventDefinition.timeDuration.body);

      if (durationIsInvalid) {
        reporter.report(rootNodeId, 'Duration is not in ISO8601 Syntax.');
      }

    } else if (timerIsCycle) {
      /**
       * Because of a specific use case, we need to accept a Process which contains
       * a cyclic TimerStartEvent alongside a normal StartEvent.
       *
       * Since explicitly testing this in the validator is kinda unreliable,
       * we pass cyclic TimerStartEvents
       */
      if (rootNodeIsStartEvent) {
        return;
      }

      reporter.report(rootNodeId, 'Cyclic Timer definitions are currently not supported.');
    } else {
      reporter.report(rootNodeId, 'Unknown Timer Event Definition.');
    }
  }

  function check(node: IModdleElement, reporter: BpmnLintReporter): void {
    const nodeIsEvent: boolean = lintUtils.isAny(node, handledEventList);

    if (nodeIsEvent) {
      const eventElement: IEventElement = node as IEventElement;

      const nodeContainsNoEventDefinitions: boolean = eventElement.eventDefinitions === undefined
                                                   || eventElement.eventDefinitions.length === 0;

      if (nodeContainsNoEventDefinitions) {
        return;
      }

      for (const currentEventDefinition of eventElement.eventDefinitions) {
        const currentEventDefIsTimer: boolean = lintUtils.is(currentEventDefinition, 'bpmn:TimerEventDefinition');

        if (currentEventDefIsTimer) {
          const currentTimerEventDefinition: ITimerEventDefinition = currentEventDefinition as ITimerEventDefinition;
          const nodeIsStartEvent: boolean = lintUtils.is(node, 'bpmn:StartEvent');
          validateTimerEventDefinition(currentTimerEventDefinition, node.id, nodeIsStartEvent, reporter);
        }
      }
    }
  }

  return {
    check: check,
  };
};
