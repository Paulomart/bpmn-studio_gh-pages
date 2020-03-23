import {BoundaryEvent} from '../../../model_duplications/index';
import {IBoundaryEventHandler} from './iboundary_event_handler';

/**
 * Creates instances of BoundaryEventHandlers.
 */
export interface IBoundaryEventHandlerFactory {
  /**
   * Returns a new Instance of the BoundaryEventHandler for the given BoundaryEvent.
   *
   * @async
   * @param   flowNode The BoundaryEvent for which to create a handler.
   * @returns          The created BoundaryEventHandler.
   */
  create(flowNode: BoundaryEvent): Promise<IBoundaryEventHandler>;
}
