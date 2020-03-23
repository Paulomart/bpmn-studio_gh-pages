import {ExternalTask, ExternalTaskResultBase} from './data_models/external_task/index';

/**
 * Definition of the HandleExternalTask Callback.
 */
export type HandleExternalTaskAction<TPayload, TResult> = (externalTask: ExternalTask<TPayload>) => Promise<ExternalTaskResultBase>

/**
 * Periodically fetches, locks and processes ExternalTasks for a given topic.
 */
export interface IExternalTaskWorker {

  /**
   * Id of worker
   */
  workerId: string;

  /**
   * Tells the worker to start polling for ExternalTasks.
   */
  start(): void;

  /**
   * Tells the worker to stop polling for ExternalTasks.
   */
  stop(): void;
}
