/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bpmnEvents from './bpmn_events/index';
import * as systemEvents from './system_events/index';

import * as baseEventMessage from './base_event_message';
import * as callbackTypes from './callback_types';
import * as eventAggregatorSettings from './event_aggregator_settings';

// tslint:disable-next-line:no-namespace
export namespace Messages {
  export import BaseEventMessage = baseEventMessage.BaseEventMessage;
  export import BpmnEvents = bpmnEvents;
  export import CallbackTypes = callbackTypes;
  export import EventAggregatorSettings = eventAggregatorSettings;
  export import SystemEvents = systemEvents;
}
