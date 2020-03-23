import * as cronparser from 'cron-parser';
import {Logger} from 'loggerhythm';
import * as moment from 'moment';
import * as schedule from 'node-schedule';
import * as uuid from 'node-uuid';

import {UnprocessableEntityError} from '@essential-projects/errors_ts';
import {IEventAggregator} from '@essential-projects/event_aggregator_contracts';
import {
  ITimerService, Timer, TimerType,
} from '@essential-projects/timing_contracts';

interface IJobsCache {
  [timerId: string]: schedule.Job;
}

const logger = Logger.createLogger('essential-projects:timing:service');

export class TimerService implements ITimerService {

  private jobs: IJobsCache = {};

  private readonly eventAggregator: IEventAggregator = undefined;

  constructor(eventAggregator: IEventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  public cancel(timerId: string): void {

    const job = this.getJob(timerId);

    if (job) {
      schedule.cancelJob(job);
      this.removeJob(timerId);
    }
  }

  public oneShot(date: moment.Moment, eventName: string): string {

    if (!date) {
      throw new Error('Must provide an expiration date for a one-shot timer!');
    }

    return this.createTimer(TimerType.oneShot, date, eventName);
  }

  public cronjob(crontab: string, eventName: string): string {

    if (!crontab) {
      throw new Error('Must provide a crontab for a periodic timer!');
    }

    return this.createTimer(TimerType.cron, crontab, eventName);
  }

  private createTimer(
    timerType: TimerType,
    value: moment.Moment | string,
    eventName: string,
  ): string {

    const timerData: Timer = {
      id: uuid.v4(),
      type: timerType,
      value: value,
      eventName: eventName,
      lastElapsed: undefined,
    };

    this.ensureTimerIsValid(timerData);

    this.createJob(timerData.id, timerData, eventName);

    return timerData.id;
  }

  private ensureTimerIsValid(timer: Timer): void {

    const timerIsOneShotTimer = timer.type === TimerType.oneShot;
    if (timerIsOneShotTimer) {
      this.validateOneShotTimer(timer);
    } else {
      this.validatePeriodicTimer(timer);
    }
  }

  private validateOneShotTimer(timer: Timer): void {

    if (!timer.value) {
      const errorMessage = `One-shot timer ${timer.eventName} does not have an expiration date!`;
      logger.error(errorMessage);

      const noExpDateError = new UnprocessableEntityError(errorMessage);
      noExpDateError.additionalInformation = <any> {
        timer: timer,
      };

      throw noExpDateError;
    }
  }

  private validatePeriodicTimer(timer: Timer): void {

    try {
      cronparser.parseExpression(timer.value as string);
    } catch (error) {
      const errorMessage = `${timer.value} is not a valid cron expression!`;
      logger.error(errorMessage);

      const invalidCrontabError = new UnprocessableEntityError(errorMessage);
      error.additionalInformation = <any> {
        validationError: error.message,
        timer: timer,
      };

      throw invalidCrontabError;
    }
  }

  private createJob(timerId: string, timer: Timer, eventName: string): schedule.Job {

    const timerValue = timer.type === TimerType.cron
      ? timer.value as string
      : (timer.value as moment.Moment).toDate();

    const job = schedule.scheduleJob(timerValue, (): void => {
      return this.timerElapsed(eventName);
    });

    if (!job) {
      throw new Error('an error occured during job scheduling');
    }

    this.cacheJob(timerId, job);

    return job;
  }

  private timerElapsed(eventName: string): void {
    this.eventAggregator.publish(eventName);
  }

  private getJob(timerId: string): schedule.Job {
    return this.jobs[timerId];
  }

  private cacheJob(timerId: string, job: schedule.Job): void {
    this.jobs[timerId] = job;
  }

  private removeJob(timerId: string): void {
    if (this.jobs[timerId]) {
      delete this.jobs[timerId];
    }
  }

}
