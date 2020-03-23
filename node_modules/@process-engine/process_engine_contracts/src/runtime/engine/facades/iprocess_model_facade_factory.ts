import {Process} from '../../../model_duplications/index';

import {IProcessModelFacade} from './iprocess_model_facade';

/**
 * Creates instances of the ProcessModelFacade.
 *
 * The facade allows to run queries for a certain ProcessModel, without
 * having to touch the ProcessModel itself.
 */
export interface IProcessModelFacadeFactory {
  /**
   * Creates a new ProcessModelFacade for the given ProcessModel.
   *
   * @param   processModel The ProcessModel for which to create a Facade.
   * @returns              The created ProcessModelFacade.
   */
  create(processModel: Process): IProcessModelFacade;
}
