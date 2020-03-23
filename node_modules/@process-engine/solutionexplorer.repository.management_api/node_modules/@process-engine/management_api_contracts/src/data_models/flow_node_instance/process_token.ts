import {IIdentity} from '@essential-projects/iam_contracts';
import {ProcessTokenType} from './process_token_type';

export class ProcessToken {

  public processInstanceId: string;
  public processModelId: string;
  public correlationId: string;
  public flowNodeInstanceId: string;
  public identity: IIdentity;
  public createdAt: Date;
  public caller: string;
  public type: ProcessTokenType;
  public payload: any;

}
