/**
 * Describes the payload that must be send with a extendLock HTTP POST request.
 */
export class ExtendLockRequestPayload {

  public readonly workerId: string;
  public readonly additionalDuration: number;

  constructor(workerId: string, additionalDuration: number) {
    this.workerId = workerId;
    this.additionalDuration = additionalDuration;
  }

}
