import {FlowNode} from '../../../model_duplications/index';
import {ProcessToken} from '../../types';
import {IFlowNodeHandler} from './iflow_node_handler';

/**
 * Creates instances of a FlowNodeHandler for a specific FlowNode type.
 *
 * This is currently used for ServiceTasks, ParallelGateways and IntermediateEvents,
 * which use multiple handlers.
 */
export interface IFlowNodeHandlerDedicatedFactory<TFlowNode extends FlowNode> {

  /**
   * Returns a new Instance of the FlowNodeHandler for the given FlowNode.
   *
   * @async
   * @param   flowNode     The FlowNode for which to create a handler.
   * @param   processToken Optional: The current ProcessToken.
   *                       This can be used to store unique instances
   *                       of a handler.
   * @returns              The created FlowNodeHandler.
   */
  create(flowNode: TFlowNode, processToken?: ProcessToken): Promise<IFlowNodeHandler<TFlowNode>>;
}
