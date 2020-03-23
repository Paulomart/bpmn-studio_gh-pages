import {Subscription} from '@essential-projects/event_aggregator_contracts';

/**
 * The base class for definining cronjob messages.
 */
export class CronjobBaseEvent {

  public readonly subscription: Subscription;
  public readonly startEventId: string;
  public readonly cronjob: string;

  constructor(
    subscription: Subscription,
    startEventId: string,
    cronjob: string,
  ) {
    this.subscription = subscription;
    this.startEventId = startEventId;
    this.cronjob = cronjob;

  }

}

export class CronjobBaseEventMessage {

  public readonly processModelId: string;
  public readonly cronjobs: Array<CronjobBaseEvent>;

  constructor(processModelId: string, cronjobs: Array<CronjobBaseEvent>) {
    this.processModelId = processModelId;
    this.cronjobs = cronjobs;
  }

}
