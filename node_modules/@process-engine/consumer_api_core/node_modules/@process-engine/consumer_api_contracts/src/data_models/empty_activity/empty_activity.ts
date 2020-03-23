import {BpmnType} from '../bpmn_type';

/**
 * Describes an EmptyActivity.
 *
 * An empty activity is an activity that doesn't do anything but pass on the
 * token it received.
 *
 * Think of it as kind of a break point that you can set in your diagram to halt
 * its execution.
 */
export class EmptyActivity {

  public readonly flowNodeType: BpmnType = BpmnType.emptyActivity;
  public id: string;
  public flowNodeInstanceId?: string;
  public name: string;
  public correlationId: string;
  public processModelId: string;
  public processInstanceId?: string;
  public tokenPayload: any;

}
