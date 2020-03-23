import {EndEventReachedMessage, TerminateEndEventReachedMessage} from './bpmn_events';
import {
  ActivityFinishedMessage,
  ActivityReachedMessage,
  BoundaryEventTriggeredMessage,
  EmptyActivityFinishedMessage,
  EmptyActivityReachedMessage,
  IntermediateCatchEventFinishedMessage,
  IntermediateCatchEventReachedMessage,
  IntermediateThrowEventTriggeredMessage,
  ManualTaskFinishedMessage,
  ManualTaskReachedMessage,
  ProcessErrorMessage,
  ProcessStartedMessage,
  UserTaskFinishedMessage,
  UserTaskReachedMessage,
} from './system_events';

export type OnBoundaryEventTriggeredCallback = (boundaryEventTriggered: BoundaryEventTriggeredMessage) => void | Promise<void>;

export type OnIntermediateThrowEventTriggeredCallback =
  (intermediateThrowEventTriggered: IntermediateThrowEventTriggeredMessage) => void | Promise<void>;

export type OnIntermediateCatchEventReachedCallback =
  (intermediateCatchEventReached: IntermediateCatchEventReachedMessage) => void | Promise<void>;
export type OnIntermediateCatchEventFinishedCallback =
  (intermediateCatchEventFinished: IntermediateCatchEventFinishedMessage) => void | Promise<void>;

export type OnActivityReachedCallback = (activityReached: ActivityReachedMessage) => void | Promise<void>;
export type OnActivityFinishedCallback = (activityFinished: ActivityFinishedMessage) => void | Promise<void>;

export type OnEmptyActivityWaitingCallback = (userTaskWaiting: EmptyActivityReachedMessage) => void | Promise<void>;
export type OnEmptyActivityFinishedCallback = (userTaskFinished: EmptyActivityFinishedMessage) => void | Promise<void>;

export type OnUserTaskWaitingCallback = (userTaskWaiting: UserTaskReachedMessage) => void | Promise<void>;
export type OnUserTaskFinishedCallback = (userTaskFinished: UserTaskFinishedMessage) => void | Promise<void>;

export type OnManualTaskWaitingCallback = (manualTaskWaiting: ManualTaskReachedMessage) => void | Promise<void>;
export type OnManualTaskFinishedCallback = (manualTaskFinished: ManualTaskFinishedMessage) => void | Promise<void>;

export type OnProcessStartedCallback = (processStarted: ProcessStartedMessage) => void | Promise<void>;
export type OnProcessErrorCallback = (processError: ProcessErrorMessage) => void | Promise<void>;
export type OnProcessEndedCallback = (processEnded: EndEventReachedMessage) => void | Promise<void>;
export type OnProcessTerminatedCallback = (processTerminated: TerminateEndEventReachedMessage) => void | Promise<void>;
