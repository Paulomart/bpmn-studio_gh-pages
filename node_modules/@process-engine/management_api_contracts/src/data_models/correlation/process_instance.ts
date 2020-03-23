import {IIdentity} from '@essential-projects/iam_contracts';

import {CorrelationState} from './correlation_state';

/**
 * Describes a ProcessInstance.
 */
export class ProcessInstance {

  public correlationId: string;
  public processDefinitionName: string;
  public processModelId: string;
  public processInstanceId?: string;
  public parentProcessInstanceId?: string;
  public hash: string;
  public xml: string;
  public state: CorrelationState;
  public error: Error;
  public identity: IIdentity;
  public createdAt?: Date;
  public finishedAt?: Date;
  public terminatedBy?: IIdentity;

}
