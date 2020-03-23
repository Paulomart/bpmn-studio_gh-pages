/* eslint-disable no-param-reassign */
import {Logger} from 'loggerhythm';
import * as moment from 'moment';

import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  APIs,
  DataModels,
  Messages,
} from '@process-engine/consumer_api_contracts';
import {IExternalTaskService} from '@process-engine/persistence_api.contracts';

const logger = new Logger('processengine:consumer_api:external_task_service');

export class ExternalTaskService implements APIs.IExternalTaskConsumerApi {

  private readonly eventAggregator: IEventAggregator;
  private readonly externalTaskService: IExternalTaskService;

  constructor(eventAggregator: IEventAggregator, externalTaskService: IExternalTaskService) {
    this.eventAggregator = eventAggregator;
    this.externalTaskService = externalTaskService;
  }

  public async fetchAndLockExternalTasks<TPayload>(
    identity: IIdentity,
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<DataModels.ExternalTask.ExternalTask<TPayload>>> {

    const tasks = await this.fetchOrWaitForExternalTasks<TPayload>(identity, topicName, maxTasks, longPollingTimeout);

    const lockExpirationTime = this.getLockExpirationDate(lockDuration);

    const lockedTasks = await Promise.map(
      tasks,
      async (externalTask: DataModels.ExternalTask.ExternalTask<TPayload>): Promise<DataModels.ExternalTask.ExternalTask<TPayload>> => {
        return this.lockExternalTask(identity, externalTask, workerId, lockExpirationTime);
      },
    );

    // An "undefined" entry matches a task that could not be locked for the worker.
    const availableTasks = lockedTasks.filter((task): boolean => task !== undefined);

    return availableTasks;
  }

  public async extendLock(identity: IIdentity, workerId: string, externalTaskId: string, additionalDuration: number): Promise<void> {

    // Note: The type of the initial payload is irrelevant for lock extension.
    const externalTask = await this.externalTaskService.getById(identity, externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    const newLockExpirationTime = this.getLockExpirationDate(additionalDuration);

    return this.externalTaskService.lockForWorker(identity, workerId, externalTaskId, newLockExpirationTime);
  }

  public async handleBpmnError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorCode: string,
    errorMessage?: string,
  ): Promise<void> {

    // Note: The type of the initial payload is irrelevant for finishing with an error.
    const externalTask = await this.externalTaskService.getById(identity, externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    const error = new DataModels.ExternalTask.BpmnError('BpmnError', errorCode, errorMessage);

    await this.externalTaskService.finishWithError(identity, externalTaskId, error);

    const errorNotificationPayload = new Messages.SystemEvents.ExternalTaskErrorMessage(error);

    this.publishExternalTaskFinishedMessage(externalTask, errorNotificationPayload);
  }

  public async handleServiceError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
    errorCode?: string,
  ): Promise<void> {

    const externalTask = await this.externalTaskService.getById(identity, externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    const error = new DataModels.ExternalTask.ServiceError('ServiceError', errorCode, errorMessage, errorDetails);

    await this.externalTaskService.finishWithError(identity, externalTaskId, error);

    const errorNotificationPayload = new Messages.SystemEvents.ExternalTaskErrorMessage(error);

    this.publishExternalTaskFinishedMessage(externalTask, errorNotificationPayload);
  }

  public async finishExternalTask<TResultType>(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    payload: TResultType,
  ): Promise<void> {

    const externalTask = await this.externalTaskService.getById(identity, externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    await this.externalTaskService.finishWithSuccess<TResultType>(identity, externalTaskId, payload);

    const successNotificationPayload = new Messages.SystemEvents.ExternalTaskSuccessMessage(payload);

    this.publishExternalTaskFinishedMessage(externalTask, successNotificationPayload);
  }

  private async fetchOrWaitForExternalTasks<TPayload>(
    identity: IIdentity,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
  ): Promise<Array<DataModels.ExternalTask.ExternalTask<TPayload>>> {

    const tasks = await this.externalTaskService.fetchAvailableForProcessing<TPayload>(identity, topicName, maxTasks);

    const taskAreNotEmpty = tasks.length > 0;

    if (taskAreNotEmpty) {
      return tasks;
    }

    // eslint-disable-next-line consistent-return
    return new Promise<Array<DataModels.ExternalTask.ExternalTask<TPayload>>>(async (resolve: Function, reject: Function): Promise<void> => {

      try {
        let subscription: Subscription;

        const timeout = setTimeout((): void => {
          this.eventAggregator.unsubscribe(subscription);
          return resolve([]);
        }, longPollingTimeout);

        const eventName = `/externaltask/topic/${topicName}/created`;
        subscription = this.eventAggregator.subscribeOnce(eventName, async (): Promise<void> => {
          clearTimeout(timeout);
          const availableTasks = await this.externalTaskService.fetchAvailableForProcessing<TPayload>(identity, topicName, maxTasks);

          return resolve(availableTasks);
        });
      } catch (error) {
        logger.error('Failed to fetch and lock ExternalTasks!', error);
        return reject(error);
      }
    });
  }

  /**
   * Locks the given external task for the given Worker until the given
   * expiration time.
   *
   * @async
   * @param workerId           The ID of the worker for which to lock the
   *                           ExternalTask.
   * @param externalTaskId     The ID of the ExternalTask to lock.
   * @param lockExpirationTime The time at which to lock will be released.
   * @returns                  The clocked ExternalTask.
   */
  private async lockExternalTask<TPayload>(
    identity: IIdentity,
    externalTask: DataModels.ExternalTask.ExternalTask<TPayload>,
    workerId: string,
    lockExpirationTime: Date,
  ): Promise<DataModels.ExternalTask.ExternalTask<TPayload>> {

    try {
      await this.externalTaskService.lockForWorker(identity, workerId, externalTask.id, lockExpirationTime);

      externalTask.workerId = workerId;
      externalTask.lockExpirationTime = lockExpirationTime;

      return externalTask;
    } catch (error) {
      // eslint-disable-next-line max-len
      logger.warn(`Failed to lock ExternalTask ${externalTask.id} for worker ${workerId}. This can happen, if the task was already locked by a different worker.`);
      logger.warn('Error: ', error.message);

      return undefined;
    }
  }

  /**
   * Ensures that the given worker is authorized to access the given ExternalTask.
   *
   * @param externalTask   The ExternalTask for which to validate access rights.
   * @param externalTaskId The ExternalTaskID the worker attempted to query.
   * @param workerId       The ID of the worker attempting to manipulate the
   *                       ExternalTask.
   */
  private ensureExternalTaskCanBeAccessedByWorker<TPayload>(
    externalTask: DataModels.ExternalTask.ExternalTask<TPayload>,
    externalTaskId: string,
    workerId: string,
  ): void {

    const externalTaskDoesNotExist = !externalTask;
    if (externalTaskDoesNotExist) {
      throw new EssentialProjectErrors.NotFoundError(`External Task with ID '${externalTaskId}' not found.`);
    }

    const externalTaskIsAlreadyFinished = externalTask.state === DataModels.ExternalTask.ExternalTaskState.finished;
    if (externalTaskIsAlreadyFinished) {
      throw new EssentialProjectErrors.GoneError(`External Task with ID '${externalTaskId}' has been finished and is no longer accessible.`);
    }

    const now = moment();
    const taskReleaseTime = moment(externalTask.lockExpirationTime);

    const externalTaskIsLockedByOtherWorker = externalTask.workerId !== workerId && now.isBefore(taskReleaseTime);
    if (externalTaskIsLockedByOtherWorker) {
      const msg = `External Task with ID '${externalTaskId}' is locked by another worker, until ${taskReleaseTime.toISOString()}.`;
      throw new EssentialProjectErrors.LockedError(msg);
    }
  }

  /**
   * Takes the given duration in ms and adds it to the current datetime.
   * The result is returned as a date which can be used as an unlock date.
   *
   * @param   duration The duration in ms to use for the new unlock date.
   * @returns          The calculated lockout date.
   */
  private getLockExpirationDate(duration: number): Date {
    return moment()
      .add(duration, 'milliseconds')
      .toDate();
  }

  /**
   * Publishes a message to the EventAggregator, which notifies about a finished
   * ExternalTask.
   *
   * @param externalTask The ExternalTask for which to publish a notification.
   * @param result       The result of the ExternalTask's execution.
   */
  private publishExternalTaskFinishedMessage<TPayload, TResult>(
    externalTask: DataModels.ExternalTask.ExternalTask<TPayload>,
    result: TResult,
  ): void {

    const externalTaskFinishedEventName = `/externaltask/flownodeinstance/${externalTask.flowNodeInstanceId}/finished`;

    this.eventAggregator.publish(externalTaskFinishedEventName, result);
  }

}
