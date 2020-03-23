import {IIdentity} from '@essential-projects/iam_contracts';

import {ExternalTask} from '../data_models/external_task/index';

/**
 * Service for ProcessEngine ExternalTask execution.
 * ExternalTasks are tasks which are executed by an external service.
 * In order to execute them, the service has to poll the tasks/jobs and report
 * the result back to the ProcessEngine.
 *
 * NOTE: This will be moved to the RuntimeAPI contracts soon.
 */
export interface IExternalTaskConsumerApi {

  /**
   *
   * Fetches the tasks available for a particular (external) service and locks
   * them for a defined time.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   workerId           The ID of the worker on whose behalf tasks are
   *                             fetched.
   *                             The returned tasks are locked for that worker
   *                             and can only be completed when providing the
   *                             same worker id.
   * @param   topicName          The name of the topic. This topic is used to get
   *                             the tasks for an external worker from the BPMN.
   * @param   maxTasks           The maximum number of tasks to return.
   * @param   longPollingTimeout The Long Polling timeout in milliseconds.
   * @param   lockDuration       The amount of time in ms until the fetched tasks
   *                             will be locked and inaccessible to other workers.
   * @returns                    A list of fetched and locked ExternalTasks.
   * @throws                     403, if the requesting User is forbidden to
   *                             access ExternalTasks.
   */
  fetchAndLockExternalTasks<TPayloadType>(
    identity: IIdentity,
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<ExternalTask<TPayloadType>>>;

  /**
   *
   * Extends the timeout of a lock by a given amount of time.
   *
   * @async
   * @param identity           The requesting users identity.
   * @param workerId           The ID of a worker who is locking the ExternalTask.
   * @param externalTaskId     The ID of the ExternalTask.
   * @param additionalDuration The additional amount of miliseconds by which to extend
   *                           the lock, based on the current datetime.
   * @throws                   403, if the requesting User is forbidden to access
   *                           the ExternalTask.
   * @throws                   404, if the ExternalTask was not found.
   */
  extendLock(identity: IIdentity, workerId: string, externalTaskId: string, additionalDuration: number): Promise<void>;

  /**
   *
   * Reports a business error in the context of a running ExternalTask
   * with a specific ID.
   * The error code must be specified to identify the BPMN error handler.
   *
   * @async
   * @param identity       The requesting users identity.
   * @param workerId       The ID of the worker that reports the failure.
   *                       Must match the ID of the worker who has most recently
   *                       locked the task.
   * @param externalTaskId The ID of the ExternalTask, in whose context a BPMN
   *                       error has occured.
   * @param errorCode      An error code that indicates the predefined error.
   *                       This is used to identify the BPMN error handler.
   * @param errorMessage   Optional: A message to provide with the error.
   * @throws               403, if the requesting User is forbidden to access
   *                       the ExternalTask.
   * @throws               404, if the ExternalTask was not found.
   */
  handleBpmnError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorCode: string,
    errorMessage?: string,
  ): Promise<void>;

  /**
   *
   * Reports a failure to execute an ExternalTask with a specific ID.
   *
   * @async
   * @param identity       The requesting users identity.
   * @param workerId       The ID of the worker that reports the failure.
   *                       Must match the ID of the worker that has most
   *                       recently locked the task.
   * @param externalTaskId The ID of the ExternalTask to report a failure for.
   * @param errorMessage   A message indicating the reason for the failure.
   * @param errorDetails   A detailed error description.
   * @param errorMessage   Optional: A code to provide with the error.
   * @throws               403, if the requesting User is forbidden to access
   *                       the ExternalTask.
   * @throws               404, if the ExternalTask was not found.
   */
  handleServiceError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
    errorCode?: string,
  ): Promise<void>;

  /**
   *
   * Completes an ExternalTask by ID and updates any related process variables.
   *
   * @async
   * @param  identity       The requesting users identity.
   * @param  workerId       The ID of the worker that completes the task.
   *                        Must match the ID of the worker who has most
   *                        recently locked the task.
   * @param  externalTaskId The ID of the ExternalTask to finish.
   * @param  result         The result of the ExternalTasks execution.
   * @throws                403, if the requesting User is forbidden to access
   *                        the ExternalTask.
   * @throws                404, if the ExternalTask was not found.
   */
  finishExternalTask<TResultType>(identity: IIdentity, workerId: string, externalTaskId: string, result: TResultType): Promise<void>;
}
