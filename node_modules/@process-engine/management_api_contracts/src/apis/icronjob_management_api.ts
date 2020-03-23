import {IIdentity} from '@essential-projects/iam_contracts';

import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {CronjobHistoryList, CronjobList} from '../data_models/cronjob/index';
import {Messages} from '../messages/index';

/**
 * The ICronjobManagementApi is used to query cronjobs from the ProcessEngine.
 */
export interface ICronjobManagementApi {

  /**
   * Retrieves a list of all active cronjobs that the given identity is allowed
   * to see.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of cronjobs.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   */
  getAllActiveCronjobs(identity: IIdentity, offset?: number, limit?: number): Promise<CronjobList>;

  /**
   * Returns the Cronjob execution history for the given ProcessModel.
   * Can optionally be filtered by a StartEventId as well.
   *
   * @async
   * @param   identity       The executing users identity.
   * @param   processModelId The ID of the ProcessModel for which to get the
   *                         cronjob history.
   * @param   startEventId   Optional: The ID of the StartEvent for which to
   *                         get the cronjob history.
   * @param   offset         Optional: The number of records to skip.
   * @param   limit          Optional: The max. number of records to get.
   * @returns              A list of matching cronjobs.
   */
  getCronjobExecutionHistoryForProcessModel(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
    offset?: number,
    limit?: number,
  ): Promise<CronjobHistoryList>;

  /**
   * Returns the Cronjob execution history for the given crontab.
   *
   * @async
   * @param   identity The executing users identity.
   * @param   crontab  The crontab for which to get the execution history.
   * @param   offset   Optional: The number of records to skip.
   * @param   limit    Optional: The max. number of records to get.
   * @returns        A list of matching cronjobs.
   */
  getCronjobExecutionHistoryForCrontab(identity: IIdentity, crontab: string, offset?: number, limit?: number): Promise<CronjobHistoryList>;

  /**
   * Executes the provided callback when a Cronjob is created.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when a
   *                             new Cronjob is created.
   *                             The message passed to the callback contains
   *                             further information about the Cronjob.
   * @param   subscribeOnce      Optional: If set to true, the subscription will
   *                             be automatically disposed, after the notification
   *                             was received once.
   * @returns                    The subscription created by the EventAggregator.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to create
   *                             event subscriptions.
   */
  onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a Cronjob is stopped.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             Cronjob is stopped.
   *                             The message passed to the callback contains
   *                             further information about the Cronjob.
   * @param   subscribeOnce      Optional: If set to true, the subscription will
   *                             be automatically disposed, after the notification
   *                             was received once.
   * @returns                    The subscription created by the EventAggregator.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to create
   *                             event subscriptions.
   */
  onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a Cronjob for the given identity is updated.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when a new
   *                             Cronjob for the identity is updated.
   *                             The message passed to the callback contains
   *                             further information about the Cronjob.
   * @param   subscribeOnce      Optional: If set to true, the subscription will
   *                             be automatically disposed, after the notification
   *                             was received once.
   * @returns                    The subscription created by the EventAggregator.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to create
   *                             event subscriptions.
   */
  onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a Cronjob for the given identity is executed.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             Cronjob for the identity is executed.
   *                             The message passed to the callback contains
   *                             further information about the Cronjob.
   * @param   subscribeOnce      Optional: If set to true, the subscription will
   *                             be automatically disposed, after the notification
   *                             was received once.
   * @returns                    The subscription created by the EventAggregator.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to create
   *                             event subscriptions.
   */
  onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a Cronjob for the given identity is removed.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             Cronjob for the identity is removed.
   *                             The message passed to the callback contains
   *                             further information about the Cronjob.
   * @param   subscribeOnce      Optional: If set to true, the subscription will
   *                             be automatically disposed, after the notification
   *                             was received once.
   * @returns                    The subscription created by the EventAggregator.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to create
   *                             event subscriptions.
   */
  onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;
}
