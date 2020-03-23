import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {ManualTaskList} from '../data_models/manual_task/index';
import {Messages} from '../messages/index';

/**
 * The IManualTaskConsumerApi is used to retreive and manage ManualTasks.
 */
export interface IManualTaskConsumerApi {

  /**
   * Retrieves a list of all suspended ManualTasks belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  processModelId      The ID of the ProcessModel for which to
   *                             retrieve the ManualTasks.
   * @returns                    A list of waiting ManualTasks for the given
   *                             ProcessModel.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   */
  getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<ManualTaskList>;

  /**
   * Retrieves a list of all suspended ManualTasks belonging to an specific
   * ProcessInstance.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  processInstanceId   The ID of the ProcessInstance for which to
   *                             retrieve the ManualTasks.
   * @returns                    A list of waiting ManualTasks for the given
   *                             ProcessInstance.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessInstance.
   */
  getManualTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<ManualTaskList>;

  /**
   * Retrieves a list of all suspended ManualTasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  correlationId       The ID of the Correlation for which to
   *                             retrieve the ManualTasks.
   * @returns                    A list of waiting Manualtasks for the given
   *                             Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation.
   */
  getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<ManualTaskList>;

  /**
   * Retrieves a list of all suspended ManualTasks belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  correlationId       The ID of the Correlation for which to retrieve the
   *                             ManualTasks.
   * @param  processModelId      The ID of the ProcessModel for which to retrieve the
   *                             ManualTasks.
   * @returns                    A list of waiting ManualTasks for the given
   *                             ProcessModel and Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation or the ProcessModel.
   */
  getManualTasksForProcessModelInCorrelation(identity: IIdentity, processModelId: string, correlationId: string): Promise<ManualTaskList>;

  /**
   * Gets all waiting ManualTasks belonging to the given identity.
   *
   * @async
   * @param   identity           The identity for which to get the ManualTasks.
   * @returns                    The list of EmptyActivities that the identity
   *                             can access.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   */
  getWaitingManualTasksByIdentity(identity: IIdentity): Promise<ManualTaskList>;

  /**
   * Finishes a ManualTask belonging to an instance of a specific ProcessModel
   * within a Correlation.
   *
   * @async
   * @param identity             The requesting users identity.
   * @param processInstanceId    The ID of the ProcessInstance for which to
   *                             finish a ManualTask.
   * @param correlationId        The ID of the Correlation for which to finish
   *                             a ManualTask.
   * @param manualTaskInstanceId The instance ID of a ManualTask to finish.
   * @param manualTaskResult     Optional: Contains a set of results with which
   *                             to finish the ManualTask.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ManualTask.
   * @throws {NotFoundError}     If the ProcessInstance, the Correlation,
   *                             or the ManualTask was not found.
   */
  finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void>;

  /**
   * Executes the provided callback when a ManualTask is reached.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when a
   *                             new ManualTask is waiting.
   *                             The message passed to the callback contains
   *                             further information about the ManualTask.
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
  onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a ManualTask is finished.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             ManualTask is finished.
   *                             The message passed to the callback contains
   *                             further information about the ManualTask.
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
  onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a ManualTask for the given identity is reached.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when a new
   *                             ManualTask for the identity is waiting.
   *                             The message passed to the callback contains
   *                             further information about the ManualTask.
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
  onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when a ManualTask for the given identity is finished.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             ManualTask for the identity is finished.
   *                             The message passed to the callback contains
   *                             further information about the ManualTask.
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
  onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;
}
