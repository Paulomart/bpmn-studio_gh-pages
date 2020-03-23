import {IIdentity} from '@essential-projects/iam_contracts';

import {EventList, EventTriggerPayload} from '../data_models/event/index';

/**
 * The IEventConsumerApi is used to retrieve waiting events and to trigger them.
 */
export interface IEventConsumerApi {

  /**
   * Retrieves a list of all triggerable events belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel for which to
   *                             retrieve the events.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of triggerable events for the given
   *                             ProcessModel.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   */
  getEventsForProcessModel(identity: IIdentity, processModelId: string, offset?: number, limit?: number): Promise<EventList>;

  /**
   * Retrieves a list of all triggerable events belonging to a Correlation.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   correlationId      The ID of the Correlation for which to retrieve
   *                             the events.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of triggerable events for the given
   *                             Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation.
   */
  getEventsForCorrelation(identity: IIdentity, correlationId: string, offset?: number, limit?: number): Promise<EventList>;

  /**
   * Retrieves a list of all triggerable events belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   correlationId      The ID of the Correlation for which to retrieve
   *                             the events.
   * @param   processModelId     The ID of the ProcessModel for which to retrieve
   *                             the events.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of triggerable events for the given
   *                             ProcessModel and Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation or the ProcessModel.
   */
  getEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<EventList>;

  /**
   * Triggers a message event.
   *
   * @async
   * @param identity             The requesting users identity.
   * @param messageName          The name of the message to trigger.
   * @param payload              The payload with which to trigger the message.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to trigger events.
   */
  triggerMessageEvent(identity: IIdentity, messageName: string, payload?: EventTriggerPayload): Promise<void>;

  /**
   * Triggers a signal event.
   *
   * @async
   * @param identity             The requesting users identity.
   * @param signalName           The name of the signal to trigger.
   * @param payload              The payload with which to trigger the signal.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to trigger events.
   */
  triggerSignalEvent(identity: IIdentity, signalName: string, payload?: EventTriggerPayload): Promise<void>;
}
