import {IIdentity} from '@essential-projects/iam_contracts';

import {EndEventReachedMessage, ProcessStartedMessage} from '../../messages';

/**
 * This service handles the execution of ProcessModels.
 */
export interface IExecuteProcessService {

  /**
   * Executes a ProcessModel.
   * Resolves when execution is completed.
   *
   * In case the calling service is to resolve immediately after starting the
   * ProcessModel, this method must not be awaited.
   *
   * @async
   * @param identity       The requesting users identity.
   * @param processModelId The ID of the ProcessModel to execute.
   * @param correlationId  The CorrelationId to use.
   *                       If not provided, it will be generated.
   * @param startEventId   The ID of the StartEvent by which to start the
   *                       ProcessModel.
   * @param initialPayload The payload to pass to the StartEvent.
   * @param caller         Optional: If a Subprocess is started, this will
   *                       contain the ID of the parent Process.
   */
  start<TPayload>(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    startEventId?: string,
    initialPayload?: TPayload,
    caller?: string,
  ): Promise<ProcessStartedMessage>;

  /**
   * Executes a ProcessModel.
   * Resolves when the first EndEvent was reached.
   *
   * @async
   * @param identity       The requesting users identity.
   * @param processModelId The ID of the ProcessModel to execute.
   * @param correlationId  The CorrelationId to use.
   *                       If not provided, it will be generated.
   * @param startEventId   The ID of the StartEvent by which to start the
   *                       ProcessModel.
   * @param initialPayload The payload to pass to the StartEvent.
   * @param caller         Optional: If a Subprocess is started, this will
   *                       contain the ID of the parent Process.
   */
  startAndAwaitEndEvent<TPayload>(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    startEventId?: string,
    initialPayload?: TPayload,
    caller?: string,
  ): Promise<EndEventReachedMessage>;

  /**
   * Executes a ProcessModel.
   * Resolves when a given EndEvent was reached.
   *
   * @async
   * @param identity       The requesting users identity.
   * @param processModelId The ID of the ProcessModel to execute.
   * @param correlationId  The CorrelationId to use.
   *                       If not provided, it will be generated.
   * @param endEventId     The ID of the EndEvent to wait for.
   * @param startEventId   The ID of the StartEvent by which to start the
   *                       ProcessModel.
   * @param initialPayload The payload to pass to the StartEvent.
   * @param caller         Optional: If a Subprocess is started, this will
   *                       contain the ID of the parent Process.
   */
  startAndAwaitSpecificEndEvent<TPayload>(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    endEventId: string,
    startEventId?: string,
    initialPayload?: TPayload,
    caller?: string,
  ): Promise<EndEventReachedMessage>;
}
