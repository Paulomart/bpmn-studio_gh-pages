import {IIdentity} from '@essential-projects/iam_contracts';

export class ActiveToken {

  // header
  public processInstanceId: string;
  public processModelId: string;
  public correlationId: string;
  public flowNodeId: string;
  public flowNodeInstanceId: string;
  public identity: IIdentity;
  public createdAt: Date;
  // payload
  public payload: any;

}
