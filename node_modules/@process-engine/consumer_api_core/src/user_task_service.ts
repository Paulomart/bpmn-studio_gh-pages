/* eslint-disable @typescript-eslint/no-explicit-any */
import {BadRequestError, NotFoundError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIAMService, IIdentity, IIdentityService} from '@essential-projects/iam_contracts';
import {APIs, DataModels, Messages} from '@process-engine/consumer_api_contracts';
import {
  BpmnType,
  FlowNodeInstance,
  FlowNodeInstanceState,
  ICorrelationService,
  IFlowNodeInstanceService,
  IProcessModelUseCases,
  Model,
  ProcessToken,
  ProcessTokenType,
} from '@process-engine/persistence_api.contracts';
import {
  IFlowNodeInstanceResult,
  IProcessModelFacade,
  IProcessModelFacadeFactory,
  IProcessTokenFacadeFactory,
  FinishUserTaskMessage as InternalFinishUserTaskMessage,
} from '@process-engine/process_engine_contracts';

import {NotificationAdapter} from './adapters/index';
import {applyPagination} from './paginator';
import * as ProcessModelCache from './process_model_cache';

const superAdminClaim = 'can_manage_process_instances';
const canSubscribeToEventsClaim = 'can_subscribe_to_events';

export class UserTaskService implements APIs.IUserTaskConsumerApi {

  private readonly correlationService: ICorrelationService;
  private readonly eventAggregator: IEventAggregator;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;
  private readonly identityService: IIdentityService;
  private readonly iamService: IIAMService;
  private readonly notificationAdapter: NotificationAdapter;
  private readonly processModelFacadeFactory: IProcessModelFacadeFactory;
  private readonly processModelUseCase: IProcessModelUseCases;
  private readonly processTokenFacadeFactory: IProcessTokenFacadeFactory;

  // This identity is used to ensure that this service can work with full ProcessModels.
  // It needs those in order to be able to read a UserTask's config.
  private internalIdentity: IIdentity;

  constructor(
    correlationService: ICorrelationService,
    eventAggregator: IEventAggregator,
    flowNodeInstanceService: IFlowNodeInstanceService,
    identityService: IIdentityService,
    iamService: IIAMService,
    notificationAdapter: NotificationAdapter,
    processModelFacadeFactory: IProcessModelFacadeFactory,
    processModelUse: IProcessModelUseCases,
    processTokenFacadeFactory: IProcessTokenFacadeFactory,
  ) {
    this.correlationService = correlationService;
    this.eventAggregator = eventAggregator;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.identityService = identityService;
    this.iamService = iamService;
    this.notificationAdapter = notificationAdapter;
    this.processModelFacadeFactory = processModelFacadeFactory;
    this.processModelUseCase = processModelUse;
    this.processTokenFacadeFactory = processTokenFacadeFactory;
  }

  public async initialize(): Promise<void> {
    const internalToken = 'UHJvY2Vzc0VuZ2luZUludGVybmFsVXNlcg==';
    this.internalIdentity = await this.identityService.getIdentity(internalToken);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    this.notificationAdapter.removeSubscription(subscription);
  }

  public async getUserTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByProcessModel(processModelId);

    const userTaskList = await this.filterAndConvertUserTaskList(identity, suspendedFlowNodes, offset, limit);

    return userTaskList;
  }

  public async getUserTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const userTaskList = await this.filterAndConvertUserTaskList(identity, suspendedFlowNodes, offset, limit);

    return userTaskList;
  }

  public async getUserTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const suspendedFlowNodes = await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const userTaskList = await this.filterAndConvertUserTaskList(identity, suspendedFlowNodes, offset, limit);

    return userTaskList;
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const flowNodeInstances = await this.flowNodeInstanceService.queryByCorrelationAndProcessModel(correlationId, processModelId);

    const suspendedFlowNodes = flowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      return flowNodeInstance.state === FlowNodeInstanceState.suspended;
    });

    const userTaskList = await this.filterAndConvertUserTaskList(identity, suspendedFlowNodes, offset, limit);

    return userTaskList;
  }

  public async getWaitingUserTasksByIdentity(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.queryByState(FlowNodeInstanceState.suspended);

    const flowNodeInstancesOwnedByUser = suspendedFlowNodeInstances.filter((flowNodeInstance: FlowNodeInstance): boolean => {
      const isUserTask = this.checkIfIsFlowNodeIsUserTask(flowNodeInstance);
      const userIdsMatch = this.checkIfIdentityUserIDsMatch(identity, flowNodeInstance.owner);
      return isUserTask && userIdsMatch;
    });

    const userTasksToReturn = applyPagination(flowNodeInstancesOwnedByUser, offset, limit);

    const userTaskList = this.convertFlowNodeInstancesToUserTasks(identity, userTasksToReturn);

    return userTaskList;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult?: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const resultForProcessEngine = this.createUserTaskResultForProcessEngine(userTaskResult);

    const matchingFlowNodeInstance =
      await this.getFlowNodeInstanceForCorrelationInProcessInstance(correlationId, processInstanceId, userTaskInstanceId);

    if (matchingFlowNodeInstance === undefined) {
      const errorMessage =
        `ProcessInstance '${processInstanceId}' in Correlation '${correlationId}' does not have a UserTask with id '${userTaskInstanceId}'`;
      throw new NotFoundError(errorMessage);
    }

    if (matchingFlowNodeInstance.flowNodeLane !== undefined) {
      await this.ensureHasClaim(identity, matchingFlowNodeInstance.flowNodeLane);
    }

    return new Promise<void>((resolve: Function): void => {

      const userTaskFinishedEvent = Messages.EventAggregatorSettings.messagePaths.userTaskWithInstanceIdFinished
        .replace(Messages.EventAggregatorSettings.messageParams.correlationId, correlationId)
        .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, processInstanceId)
        .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, userTaskInstanceId);

      this.eventAggregator.subscribeOnce(userTaskFinishedEvent, (): void => {
        resolve();
      });

      this.publishFinishUserTaskEvent(identity, matchingFlowNodeInstance, resultForProcessEngine);
    });
  }

  public async filterAndConvertUserTaskList(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const userTasks = suspendedFlowNodes.filter(this.checkIfIsFlowNodeIsUserTask);

    const accessibleUserTasks = await this.filterInacessibleFlowNodeInstances(identity, userTasks);

    const userTasksToReturn = applyPagination(accessibleUserTasks, offset, limit);

    const userTaskList = this.convertFlowNodeInstancesToUserTasks(identity, userTasksToReturn);

    return userTaskList;
  }

  private async convertFlowNodeInstancesToUserTasks(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const suspendedUserTasks =
      await Promise.map(suspendedFlowNodes, async (flowNode): Promise<DataModels.UserTasks.UserTask> => {
        return this.convertToConsumerApiUserTask(identity, flowNode);
      });

    const userTaskList: DataModels.UserTasks.UserTaskList = {
      userTasks: suspendedUserTasks,
      totalCount: suspendedUserTasks.length,
    };

    return userTaskList;
  }

  private checkIfIsFlowNodeIsUserTask(flowNodeInstance: FlowNodeInstance): boolean {
    return flowNodeInstance.flowNodeType === BpmnType.userTask;
  }

  private checkIfIdentityUserIDsMatch(identityA: IIdentity, identityB: IIdentity): boolean {
    return identityA.userId === identityB.userId;
  }

  private async filterInacessibleFlowNodeInstances(
    identity: IIdentity,
    flowNodeInstances: Array<FlowNodeInstance>,
  ): Promise<Array<FlowNodeInstance>> {
    const isSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);

    if (isSuperAdmin) {
      return flowNodeInstances;
    }

    const accessibleFlowNodeInstances = Promise.filter(flowNodeInstances, async (item: FlowNodeInstance): Promise<boolean> => {
      return this.checkIfUserCanAccessFlowNodeInstance(identity, item);
    });

    return accessibleFlowNodeInstances;
  }

  private async checkIfUserCanAccessFlowNodeInstance(identity: IIdentity, flowNodeInstance: FlowNodeInstance): Promise<boolean> {
    try {
      if (!flowNodeInstance.flowNodeLane) {
        return true;
      }

      await this.iamService.ensureHasClaim(identity, flowNodeInstance.flowNodeLane);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async ensureHasClaim(identity: IIdentity, claimName: string): Promise<void> {
    const isSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);

    if (isSuperAdmin) {
      return;
    }

    await this.iamService.ensureHasClaim(identity, claimName);
  }

  private async checkIfUserIsSuperAdmin(identity: IIdentity): Promise<boolean> {
    try {
      await this.iamService.ensureHasClaim(identity, superAdminClaim);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async convertToConsumerApiUserTask(identity: IIdentity, userTaskInstance: FlowNodeInstance): Promise<DataModels.UserTasks.UserTask> {

    const currentUserTaskToken = userTaskInstance.getTokenByType(ProcessTokenType.onSuspend);

    const processModelFacade = await this.getProcessModelForFlowNodeInstance(identity, userTaskInstance);
    const userTaskModel = processModelFacade.getFlowNodeById(userTaskInstance.flowNodeId) as Model.Activities.UserTask;

    const formattedUserTaskToken = await this.getUserTaskTokenInOldFormat(currentUserTaskToken);

    const userTaskFormFields =
      userTaskModel.formFields.map((formField: Model.Activities.Types.UserTaskFormField): DataModels.UserTasks.UserTaskFormField => {
        return this.convertToConsumerApiFormField(formField, formattedUserTaskToken);
      });

    const userTaskConfig: DataModels.UserTasks.UserTaskConfig = {
      formFields: userTaskFormFields,
      preferredControl: this.evaluateExpressionWithOldToken(userTaskModel.preferredControl, formattedUserTaskToken),
      description: userTaskModel.description,
      finishedMessage: userTaskModel.finishedMessage,
    };

    const consumerApiUserTask: DataModels.UserTasks.UserTask = {
      flowNodeType: BpmnType.userTask,
      id: userTaskInstance.flowNodeId,
      flowNodeInstanceId: userTaskInstance.id,
      name: userTaskModel.name,
      correlationId: userTaskInstance.correlationId,
      processModelId: userTaskInstance.processModelId,
      processInstanceId: userTaskInstance.processInstanceId,
      data: userTaskConfig,
      tokenPayload: currentUserTaskToken.payload,
    };

    return consumerApiUserTask;
  }

  private async getProcessModelForFlowNodeInstance(
    identity: IIdentity,
    flowNodeInstance: FlowNodeInstance,
  ): Promise<IProcessModelFacade> {

    let processModel: Model.Process;

    // We must store the ProcessModel for each user, to account for lane-restrictions.
    // Some users may not be able to see some lanes that are visible to others.
    const cacheKeyToUse = `${flowNodeInstance.processInstanceId}-${identity.token}`;

    const cacheHasMatchingEntry = ProcessModelCache.hasEntry(cacheKeyToUse);
    if (cacheHasMatchingEntry) {
      processModel = ProcessModelCache.get(cacheKeyToUse);
    } else {
      const processModelHash = await this.getProcessModelHashForProcessInstance(flowNodeInstance.processInstanceId);
      processModel = await this.processModelUseCase.getByHash(identity, flowNodeInstance.processModelId, processModelHash);
      ProcessModelCache.add(cacheKeyToUse, processModel);
    }

    const processModelFacade = this.processModelFacadeFactory.create(processModel);

    return processModelFacade;
  }

  private async getProcessModelHashForProcessInstance(processInstanceId: string): Promise<string> {
    const processInstance = await this.correlationService.getByProcessInstanceId(this.internalIdentity, processInstanceId);

    return processInstance.hash;
  }

  private convertToConsumerApiFormField(
    formField: Model.Activities.Types.UserTaskFormField,
    oldTokenFormat: any,
  ): DataModels.UserTasks.UserTaskFormField {

    const userTaskFormField = new DataModels.UserTasks.UserTaskFormField();
    userTaskFormField.id = formField.id;
    userTaskFormField.label = this.evaluateExpressionWithOldToken(formField.label, oldTokenFormat);
    userTaskFormField.type = DataModels.UserTasks.UserTaskFormFieldType[formField.type];
    userTaskFormField.enumValues = formField.enumValues;
    userTaskFormField.defaultValue = this.evaluateExpressionWithOldToken(formField.defaultValue, oldTokenFormat);
    userTaskFormField.preferredControl = this.evaluateExpressionWithOldToken(formField.preferredControl, oldTokenFormat);

    return userTaskFormField;
  }

  private evaluateExpressionWithOldToken(expression: string, oldTokenFormat: any): string | null {

    let result: any = expression;

    if (!expression) {
      return result;
    }

    const expressionStartsOn = '${';
    const expressionEndsOn = '}';

    const isExpression = expression.charAt(0) === '$';
    if (isExpression === false) {
      return result;
    }

    const finalExpressionLength = expression.length - expressionStartsOn.length - expressionEndsOn.length;
    const expressionBody = expression.substr(expressionStartsOn.length, finalExpressionLength);

    const functionString = `return ${expressionBody}`;
    const scriptFunction = new Function('token', functionString);

    result = scriptFunction.call(undefined, oldTokenFormat);

    return result;
  }

  private async getUserTaskTokenInOldFormat(currentProcessToken: ProcessToken): Promise<any> {

    const {
      processInstanceId, processModelId, correlationId, identity,
    } = currentProcessToken;

    const processInstanceTokens = await this.flowNodeInstanceService.queryProcessTokensByProcessInstanceId(processInstanceId);

    const filteredInstanceTokens = processInstanceTokens.filter((token: ProcessToken): boolean => {
      return token.type === ProcessTokenType.onExit;
    });

    const processTokenFacade = this.processTokenFacadeFactory.create(processInstanceId, processModelId, correlationId, identity);

    const processTokenResultPromises = filteredInstanceTokens.map(async (processToken: ProcessToken): Promise<IFlowNodeInstanceResult> => {
      const processTokenFlowNodeInstance = await this.flowNodeInstanceService.queryByInstanceId(processToken.flowNodeInstanceId);

      return {
        flowNodeInstanceId: processTokenFlowNodeInstance.id,
        flowNodeId: processTokenFlowNodeInstance.flowNodeId,
        result: processToken.payload,
      };
    });

    const processTokenResults = await Promise.all(processTokenResultPromises);

    processTokenFacade.importResults(processTokenResults);

    return processTokenFacade.getOldTokenFormat();
  }

  private async getFlowNodeInstanceForCorrelationInProcessInstance(
    correlationId: string,
    processInstanceId: string,
    instanceId: string,
  ): Promise<FlowNodeInstance> {

    const suspendedFlowNodeInstances = await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const matchingInstance = suspendedFlowNodeInstances.find((instance: FlowNodeInstance): boolean => {
      return instance.id === instanceId &&
             instance.correlationId === correlationId;
    });

    return matchingInstance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createUserTaskResultForProcessEngine(finishedTask: DataModels.UserTasks.UserTaskResult): any {

    const noResultsProvided = !finishedTask || !finishedTask.formFields;

    if (noResultsProvided) {
      return {};
    }

    const formFieldResultIsNotAnObject = typeof finishedTask !== 'object'
      || typeof finishedTask.formFields !== 'object'
      || Array.isArray(finishedTask.formFields);

    if (formFieldResultIsNotAnObject) {
      throw new BadRequestError('The UserTask\'s FormFields are not an object.');
    }

    return finishedTask.formFields;
  }

  private publishFinishUserTaskEvent(
    identity: IIdentity,
    userTaskInstance: FlowNodeInstance,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): void {

    const currentToken = userTaskInstance.getTokenByType(ProcessTokenType.onSuspend);

    const finishUserTaskMessage = new InternalFinishUserTaskMessage(
      userTaskResult,
      userTaskInstance.correlationId,
      userTaskInstance.processModelId,
      userTaskInstance.processInstanceId,
      userTaskInstance.id,
      userTaskInstance.id,
      identity,
      currentToken.payload,
    );

    const finishUserTaskEvent = Messages.EventAggregatorSettings.messagePaths.finishUserTask
      .replace(Messages.EventAggregatorSettings.messageParams.correlationId, userTaskInstance.correlationId)
      .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, userTaskInstance.processInstanceId)
      .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, userTaskInstance.id);

    this.eventAggregator.publish(finishUserTaskEvent, finishUserTaskMessage);
  }

}
