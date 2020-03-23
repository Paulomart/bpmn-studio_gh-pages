/**
 * Describes an entry of a cronjob history.
 */
export class CronjobHistoryEntry {

  public processModelId: string;
  public startEventId: string;
  public crontab: string;
  public executedAt: Date;

}
