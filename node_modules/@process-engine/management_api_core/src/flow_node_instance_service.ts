import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels} from '@process-engine/management_api_contracts';
import {
  FlowNodeInstance,
  FlowNodeInstanceState,
  IFlowNodeInstanceService,
} from '@process-engine/persistence_api.contracts';

import {EmptyActivityService, ManualTaskService, UserTaskService} from './index';
import {applyPagination} from './paginator';

type Task = DataModels.EmptyActivities.EmptyActivity | DataModels.ManualTasks.ManualTask | DataModels.UserTasks.UserTask;

export class FlowNodeInstanceService implements APIs.IFlowNodeInstanceManagementApi {

  private readonly flowNodeInstanceService: IFlowNodeInstanceService;

  private readonly emptyActivityService: EmptyActivityService;
  private readonly manualTaskService: ManualTaskService;
  private readonly userTaskService: UserTaskService;

  constructor(
    flowNodeInstanceService: IFlowNodeInstanceService,
    emptyActivityService: EmptyActivityService,
    manualTaskService: ManualTaskService,
    userTaskService: UserTaskService,
  ) {
    this.flowNodeInstanceService = flowNodeInstanceService;

    this.emptyActivityService = emptyActivityService;
    this.manualTaskService = manualTaskService;
    this.userTaskService = userTaskService;
  }

  public async getAllSuspendedTasks(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.queryByState(FlowNodeInstanceState.suspended);

    const tasks = await this.convertFlowNodeInstancesToTaskList(identity, suspendedFlowNodeInstances);

    const taskList: DataModels.FlowNodeInstances.TaskList = {
      tasks: applyPagination(tasks, offset, limit),
      totalCount: tasks.length,
    };

    return taskList;
  }

  public async getSuspendedTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByProcessModel(processModelId);

    const tasks = await this.convertFlowNodeInstancesToTaskList(identity, suspendedFlowNodeInstances);

    const taskList: DataModels.FlowNodeInstances.TaskList = {
      tasks: applyPagination(tasks, offset, limit),
      totalCount: tasks.length,
    };

    return taskList;
  }

  public async getSuspendedTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const tasks = await this.convertFlowNodeInstancesToTaskList(identity, suspendedFlowNodeInstances);

    const taskList: DataModels.FlowNodeInstances.TaskList = {
      tasks: applyPagination(tasks, offset, limit),
      totalCount: tasks.length,
    };

    return taskList;
  }

  public async getSuspendedTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const tasks = await this.convertFlowNodeInstancesToTaskList(identity, suspendedFlowNodeInstances);

    const taskList: DataModels.FlowNodeInstances.TaskList = {
      tasks: applyPagination(tasks, offset, limit),
      totalCount: tasks.length,
    };

    return taskList;
  }

  public async getSuspendedTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const flowNodeInstances = await this.flowNodeInstanceService.queryActiveByCorrelationAndProcessModel(correlationId, processModelId);

    const suspendedFlowNodeInstances = flowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      return flowNodeInstance.state === FlowNodeInstanceState.suspended;
    });

    const noSuspendedFlowNodesFound = !suspendedFlowNodeInstances || suspendedFlowNodeInstances.length === 0;
    if (noSuspendedFlowNodesFound) {
      return <DataModels.FlowNodeInstances.TaskList> {
        tasks: [],
        totalCount: 0,
      };
    }

    const tasks = await this.convertFlowNodeInstancesToTaskList(identity, suspendedFlowNodeInstances);

    const taskList: DataModels.FlowNodeInstances.TaskList = {
      tasks: applyPagination(tasks, offset, limit),
      totalCount: tasks.length,
    };

    return taskList;
  }

  public async getFlowNodeInstancesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.FlowNodeInstanceList> {
    const flowNodeInstances = await this.flowNodeInstanceService.queryByProcessInstance(processInstanceId);

    const paginizedFlowNodeInstances = applyPagination(flowNodeInstances, offset, limit);

    return {flowNodeInstances: paginizedFlowNodeInstances, totalCount: flowNodeInstances.length};
  }

  private async convertFlowNodeInstancesToTaskList(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
  ): Promise<Array<Task>> {

    const emptyActivityList = await this.emptyActivityService.filterAndConvertEmptyActivityList(identity, suspendedFlowNodes);
    const manualTaskList = await this.manualTaskService.filterAndConvertManualTaskList(identity, suspendedFlowNodes);
    const userTaskList = await this.userTaskService.filterAndConvertUserTaskList(identity, suspendedFlowNodes);

    const tasks = [...emptyActivityList.emptyActivities, ...manualTaskList.manualTasks, ...userTaskList.userTasks];

    return tasks;
  }

}
