import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {EmptyActivityList} from '../data_models/empty_activity/index';
import {Messages} from '../messages/index';

/**
 * The IEmptyActivityConsumerApi is used to retrieve and manage EmptyActivities.
 */
export interface IEmptyActivityConsumerApi {

  /**
   * Retrieves a list of all suspended EmptyActivities belonging to an instance of a
   * specific ProcessModel.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel for which to
   *                             retrieve the EmptyActivities.
   * @returns                    A list of waiting EmptActivities for the given
   *                             ProcessModel.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   */
  getEmptyActivitiesForProcessModel(identity: IIdentity, processModelId: string): Promise<EmptyActivityList>;

  /**
   * Retrieves a list of all suspended EmptyActivities belonging to a specific
   * ProcessInstance.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  processInstanceId   The ID of the ProcessInstance for which to
   *                             retrieve the EmptyActivities.
   * @returns                    A list of waiting EmptActivities for the given
   *                             ProcessInstance.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessInstance.
   */
  getEmptyActivitiesForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<EmptyActivityList>;

  /**
   * Retrieves a list of all suspended EmptyActivities belonging to a specific
   * Correlation.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   correlationId      The ID of the Correlation for which to
   *                             retrieve the EmptyActivities.
   * @returns                    A list of waiting EmptActivities for the given
   *                             Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation.
   */
  getEmptyActivitiesForCorrelation(identity: IIdentity, correlationId: string): Promise<EmptyActivityList>;

  /**
   * Retrieves a list of all suspended EmptyActivities belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   correlationId      The ID of the Correlation for which to
   *                             retrieve the EmptyActivities.
   * @param   processModelId     The ID of the ProcessModel for which to
   *                             retrieve the EmptyActivities.
   * @returns                    A list of waiting EmptActivities for the given
   *                             ProcessModel and Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation or the ProcessModel.
   */
  getEmptyActivitiesForProcessModelInCorrelation(identity: IIdentity, processModelId: string, correlationId: string): Promise<EmptyActivityList>;

  /**
   * Gets all waiting EmptyActivities belonging to the given identity.
   *
   * @async
   * @param   identity           The identity for which to get the
   *                             EmptyActivities.
   * @returns                    The list of EmptyActivities that the identity
   *                             can access.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   */
  getWaitingEmptyActivitiesByIdentity(identity: IIdentity): Promise<EmptyActivityList>;

  /**
   * Finishes an EmptyActivity belonging to an instance of a specific ProcessModel
   * within a Correlation.
   *
   * @async
   * @param  identity                The requesting users identity.
   * @param  processInstanceId       The ID of the ProcessInstance for which to
   *                                 finish an EmptyActivity.
   * @param  correlationId           The ID of the Correlation for which to finish
   *                                 an EmptyActivity.
   * @param  emptyActivityInstanceId The instance ID of an EmptyActivity to finish.
   *
   * @throws {UnauthorizedError}     If the given identity does not contain a
   *                                 valid auth token.
   * @throws {ForbiddenError}        If the user is not allowed to access the
   *                                 EmptyActivity.
   * @throws {NotFoundError}         If the ProcessInstance, the Correlation,
   *                                 or the EmptyActivity was not found.
   */
  finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void>;

  /**
   * Executes the provided callback when an EmptyActivity is reached.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when a
   *                             new EmptyActivity is waiting.
   *                             The message passed to the callback contains
   *                             further information about the EmptyActivity.
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
  onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when an EmptyActivity is finished.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             EmptyActivity is finished.
   *                             The message passed to the callback contains
   *                             further information about the EmptyActivity.
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
  onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when an EmptyActivity for the given identity is reached.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when a new
   *                             EmptyActivity for the identity is waiting.
   *                             The message passed to the callback contains
   *                             further information about the EmptyActivity.
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
  onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  /**
   * Executes the provided callback when an EmptyActivity for the given identity is finished.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   callback           The callback that will be executed when an
   *                             EmptyActivity for the identity is finished.
   *                             The message passed to the callback contains
   *                             further information about the EmptyActivity.
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
  onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;
}
