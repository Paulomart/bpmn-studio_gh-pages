import {IIdentity} from '@essential-projects/iam_contracts';

import {IProcessTokenFacade} from './iprocess_token_facade';

/**
 * Creates instances of the ProcessTokenFacade.
 */
export interface IProcessTokenFacadeFactory {

  /**
   * Returns a new ProcessTokenFacade for the given ProcessInstance.
   * @param   processInstanceId The ID of the ProcessInstance for which to create
   *                            a ProcessTokenFacade.
   * @param   processModelId    The ID of the ProcessModel for which to create
   *                            a ProcessTokenFacade.
   * @param   correlationId     The ID of the Correlation for which to create
   *                            a ProcessTokenFacade.
   * @param   identity          The identity of the requesting User
   * @returns                   The created ProcessTokenFacade.
   */
  create(processInstanceId: string, processModelId: string, correlationId: string, identity: IIdentity): IProcessTokenFacade;
}
