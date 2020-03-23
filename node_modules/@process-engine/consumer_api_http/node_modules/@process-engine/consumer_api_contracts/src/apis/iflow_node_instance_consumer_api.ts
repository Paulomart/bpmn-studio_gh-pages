import {IIdentity} from '@essential-projects/iam_contracts';

import {TaskList} from '../data_models/flow_node_instance/index';
/**
 * The IFlowNodeInstanceConsumerApi is used to retreive FlowNodeInstances.
 */
export interface IFlowNodeInstanceConsumerApi {

  /**
   * Retrieves a list of all suspended Tasks.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of waiting Tasks for the given
   *                             ProcessModel.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   */
  getAllSuspendedTasks(
    identity: IIdentity,
    offset?: number,
    limit?: number,
  ): Promise<TaskList>;

  /**
   * Retrieves a list of all suspended Tasks belonging to a
   * specific ProcessModel.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  processModelId      The ID of the ProcessModel for which to
   *                             retrieve the Tasks.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of waiting Tasks for the given
   *                             ProcessModel.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   */
  getSuspendedTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset?: number,
    limit?: number,
  ): Promise<TaskList>;

  /**
   * Retrieves a list of all suspended Tasks belonging to specific
   * ProcessInstance.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  processInstanceId   The ID of the ProcessInstance for which to retrieve the
   *                             Tasks.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of waiting Tasks for the given
   *                             ProcessInstance.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessInstance.
   */
  getSuspendedTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset?: number,
    limit?: number,
  ): Promise<TaskList>;

  /**
   * Retrieves a list of all suspended Tasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  correlationId       The ID of the Correlation for which to
   *                             retrieve the Tasks.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of waiting Tasks for the given
   *                             Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation.
   */
  getSuspendedTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<TaskList>;

  /**
   * Retrieves a list of all suspended Tasks belonging to an instance of a
   * specific ProcessModel within a Correlation.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  correlationId       The ID of the Correlation for which to
   *                             retrieve the Tasks.
   * @param  processModelId      The ID of the ProcessModel for which to
   *                             retrieve the Tasks.
   * @param   offset             Optional: The number of records to skip.
   * @param   limit              Optional: The max. number of records to get.
   * @returns                    A list of waiting Tasks for the given
   *                             ProcessModel and Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation or the ProcessModel.
   */
  getSuspendedTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<TaskList>;
}
