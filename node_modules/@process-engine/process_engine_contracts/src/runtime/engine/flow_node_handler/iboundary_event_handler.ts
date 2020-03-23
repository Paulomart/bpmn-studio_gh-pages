import {FlowNode} from '../../../model_duplications/index';
import {FlowNodeInstance, ProcessToken} from '../../types';
import {IProcessModelFacade} from '../facades/iprocess_model_facade';
import {IProcessTokenFacade} from '../facades/iprocess_token_facade';

/**
 * Encapsulates the data sent with an OnTriggeredCallback.
 *
 * @param boundaryInstanceId The Instance ID of the triggered BoundaryEvent.
 * @param nextFlowNode       The FlowNode that follows the triggered BoundaryEvent.
 * @param interruptHandler   If true, the BoundaryEvent is interrupting and the
 *                           FlowNodeHandler must stop working.
 * @param eventPayload       Optional: Any payload that was sent with the
 *                           triggering event.
 */
export type OnBoundaryEventTriggeredData = {
  boundaryInstanceId: string;
  nextFlowNode: FlowNode;
  interruptHandler: boolean;
  eventPayload?: any;
};

/**
 * Defines the signature a callback for a triggered BoundaryEvent should have.
 *
 * @param data Contains information that the decorated handler will need for
 *             processing the triggered BoundaryEvent.
 */
export type OnBoundaryEventTriggeredCallback = (data: OnBoundaryEventTriggeredData) => void | Promise<void>;

/**
 * Handles the execution of a BoundaryEvent.
 */
export interface IBoundaryEventHandler {

  /**
   * Gets the instance ID of the BoundaryEvent that this handler is responsible for.
   *
   * @returns The instance ID of the corresponding BoundaryEvent.
   */
  getInstanceId(): string;

  /**
   * Initializes the BoundaryEvent and waits until its triggering event occurs.
   * For SignalEvents, this will be an incoming signal, for MessageEvents an
   * incoming message, asf.
   *
   * @async
   * @param onTriggeredCallback        The callback to run after the BoundaryEvent was triggered.
   * @param token                      The current ProcessToken.
   * @param processTokenFacade         The Facade for the current ProcessToken.
   * @param processModelFacade         The Facade for the current ProcessModel.
   * @param attachedFlowNodeInstanceId The InstanceId of the FlowNode this BoundaryEvent is attached to.
   */
  waitForTriggeringEvent(
    onTriggeredCallback: OnBoundaryEventTriggeredCallback,
    token: ProcessToken,
    processTokenFacade: IProcessTokenFacade,
    processModelFacade: IProcessModelFacade,
    attachedFlowNodeInstanceId: string,
  ): Promise<void>;

  /**
   * Resumes the BoundaryEvent and continues to wait for the triggering event to occur.
   * Basically, this UseCase works the same as waitForTriggeringEvent, except that no
   * initial state transition is performed and a FlowNodeInstance is required.
   *
   * @async
   * @param boundaryEventInstance      The instance of the BoundaryEvent to resume.
   * @param onTriggeredCallback        The callback to run after the BoundaryEvent was triggered.
   * @param token                      The current ProcessToken.
   * @param processTokenFacade         The Facade for the current ProcessToken.
   * @param processModelFacade         The Facade for the current ProcessModel.
   * @param attachedFlowNodeInstanceId The InstanceId of the FlowNode this BoundaryEvent is attached to.
   */
  resumeWait(
    boundaryEventInstance: FlowNodeInstance,
    onTriggeredCallback: OnBoundaryEventTriggeredCallback,
    token: ProcessToken,
    processTokenFacade: IProcessTokenFacade,
    processModelFacade: IProcessModelFacade,
    attachedFlowNodeInstanceId: string,
  ): Promise<void>;

  /**
   * Cancels the Execution of this BoundaryEvent.
   * This can be used by a decorated handler to cleanup its BoundaryEvents
   * after it has finished execution.
   *
   * @async
   * @param token              The current ProcessToken.
   * @param processModelFacade The Facade for the current ProcessModel.
   */
  cancel(processToken: ProcessToken, processModelFacade: IProcessModelFacade): Promise<void>;

  /**
   * Gets the FlowNode that follows after this BoundaryEvent.
   *
   * @param   processModelFacade The Facade for the current ProcessModel.
   * @returns                    The FlowNode that follows this BoundaryEvent
   */
  getNextFlowNode(processModelFacade: IProcessModelFacade): FlowNode;
}
