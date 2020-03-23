import {Process} from '../../../model_duplications/process/process';

import {IAutoStartService} from './iauto_start_service';

/**
 * This service is responsible for starting ProcessModels that make use of
 * cyclic TimerStartEvents.
 *
 * This is achieved by creating a cronjob for each unique cyclic timer definition.
 * When such a cronjob expires, all ProcessModels with a matching TimerStartEvent
 * will be triggered.
 */
export interface ICronjobService extends IAutoStartService {

  /**
   * Gets a list of all cronjobs that are currently active.
   * The cronjobs are grouped by the ProcessModel to which they belong.
   *
   * @returns A list of active Cronjobs.
   */
  getActive(): Array<CronjobConfiguration>;

  /**
   * Adds the cyclic TimerStartEvents of the given ProcessModel to the internal
   * cronjob storage, or updates it, if the ProcessModel has already been added
   * to the list.
   *
   * @param processModel
   */
  addOrUpdate(processModel: Process): void;

  /**
   * Removes the given ProcessModelId from the internal cronjob storage.
   * All orphaned cronjobs (i.e. cronjobs that no longer trigger any ProcessModels)
   * will be cleaned up as well.
   *
   * @param processModelId
   */
  remove(processModelId: string): void;
}

/**
 * Describes a cronjob employed by the CronjobService.
 */
export type CronjobConfiguration = {
  /**
   * The ID of the ProcessModel that contains the cronjob.
   */
  processModelId: string;
  /**
   * The ID of the StartEvent that contains the cronjob.
   */
  startEventId: string;
  /**
   * The crontab that describs the cronjob.
   */
  crontab: string;
  /**
   * The next time the cronjob will be triggered.
   */
  nextExecution: Date;
}
