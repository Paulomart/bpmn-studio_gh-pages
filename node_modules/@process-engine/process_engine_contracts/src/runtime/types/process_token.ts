import {IIdentity} from '@essential-projects/iam_contracts';
import {ProcessTokenType} from './process_token_type';

/**
 * The process token contains information for each FlowNodeInstance that was
 * executed during a process.
 * Each FlowNodeInstance will produce its own tokens.
 */
export class ProcessToken {

  public processInstanceId: string;
  public processModelId: string;
  public correlationId: string;
  public flowNodeInstanceId: string;
  public currentLane?: string; // Optional, because ProcessModels are not required to have lanes.
  public identity: IIdentity;
  public createdAt: Date;
  /**
   * If the token belongs to a Subprocess, this will contain the ID of the
   * parent process.
   *
   * Will be empty, if the process started the correlation.
   */
  public caller: string;
  /**
   * Determines when the token was recorded.
   * Can bei either onEnter, onExit, onSuspend, or onResume.
   */
  public type: ProcessTokenType;
  /**
   * Contains the ProcessToken's values.
   */
  public payload: any;

}
