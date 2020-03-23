import * as moment from 'moment';

/**
 * Handles the creation, execution and destruction of timers.
 */
export interface ITimerService {

  /**
   * Creates a new timer that will run only once and raise the given event
   * upon expiration.
   *
   * @param   date      Either a duration or a date. This determines when the
   *                    timer is to expire.
   * @param   eventName The name of the event to raise after the timer has
   *                    expired.
   * @returns           The ID of the created timer.
   */
  oneShot(date: moment.Moment, eventName: string): string;

  /**
   * Creates a new timer from the given cron expression
   * and raise the given event each time the cronjob has elapsed.
   *
   * @param crontab   The rule by which the timer is to run.
   * @param eventName The name of the event to raise when the timer has
   *                  elapsed.
   * @returns         The ID of the created timer.
   */
  cronjob(crontab: string, eventName: string): string;

  /**
   * Cancels the timer with the given id.
   *
   * @param timerId The id of the timer to cancel.
   */
  cancel(timerId: string): void;
}
