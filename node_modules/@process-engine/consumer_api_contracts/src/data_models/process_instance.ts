import {IIdentity} from '@essential-projects/iam_contracts';

/**
 * Describes a single ProcessInstance.
 */
export class ProcessInstance {

  public readonly id: string;
  public readonly owner: IIdentity;
  public readonly correlationId: string;
  public readonly processModelId: string;
  public readonly parentProcessInstanceId?: string;

  constructor(id: string, correlationId: string, processModelId: string, owner: IIdentity, parentProcessInstanceId?: string) {
    this.id = id;
    this.correlationId = correlationId;
    this.processModelId = processModelId;
    this.owner = owner;
    this.parentProcessInstanceId = parentProcessInstanceId;
  }

}
