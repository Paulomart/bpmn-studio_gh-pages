/**
 * Describes the payload that must be send with a fetchAndLock HTTP POST request.
 */
export class FetchAndLockRequestPayload {

  public readonly workerId: string;
  public readonly topicName: string;
  public readonly maxTasks: number;
  public readonly longPollingTimeout: number;
  public readonly lockDuration: number;

  constructor(workerId: string, topicName: string, maxTasks: number, longPollingTimeout: number, lockDuration: number) {
    this.workerId = workerId;
    this.topicName = topicName;
    this.maxTasks = maxTasks;
    this.longPollingTimeout = longPollingTimeout;
    this.lockDuration = lockDuration;
  }

}
