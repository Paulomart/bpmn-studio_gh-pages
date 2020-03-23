import {Logger} from 'loggerhythm';
import * as uuid from 'node-uuid';

import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels, Messages} from '@process-engine/management_api_contracts';

import {ICorrelationService, IProcessModelUseCases, Model} from '@process-engine/persistence_api.contracts';
import {
  EndEventReachedMessage,
  ICronjobService,
  IExecuteProcessService,
  IProcessModelFacadeFactory,
  ProcessStartedMessage,
} from '@process-engine/process_engine_contracts';

import {NotificationAdapter} from './adapters/index';
import {applyPagination} from './paginator';

const logger = Logger.createLogger('processengine:management_api:process_model_service');

export class ProcessModelService implements APIs.IProcessModelManagementApi {

  private readonly correlationService: ICorrelationService;
  private readonly cronjobService: ICronjobService;
  private readonly eventAggregator: IEventAggregator;
  private readonly executeProcessService: IExecuteProcessService;
  private readonly iamService: IIAMService;
  private readonly processModelFacadeFactory: IProcessModelFacadeFactory;
  private readonly processModelUseCase: IProcessModelUseCases;

  private readonly notificationAdapter: NotificationAdapter;

  private readonly canSubscribeToEventsClaim = 'can_subscribe_to_events';

  constructor(
    correlationService: ICorrelationService,
    cronjobService: ICronjobService,
    eventAggregator: IEventAggregator,
    executeProcessService: IExecuteProcessService,
    iamService: IIAMService,
    notificationAdapter: NotificationAdapter,
    processModelFacadeFactory: IProcessModelFacadeFactory,
    processModelUseCase: IProcessModelUseCases,
  ) {
    this.correlationService = correlationService;
    this.cronjobService = cronjobService;
    this.eventAggregator = eventAggregator;
    this.executeProcessService = executeProcessService;
    this.iamService = iamService;
    this.notificationAdapter = notificationAdapter;
    this.processModelFacadeFactory = processModelFacadeFactory;
    this.processModelUseCase = processModelUseCase;
  }

  public async getProcessModels(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ProcessModels.ProcessModelList> {

    const processModels = await this.processModelUseCase.getProcessModels(identity);
    const managementApiProcessModels =
      await Promise.map(processModels, async (processModel: Model.Process): Promise<DataModels.ProcessModels.ProcessModel> => {
        return this.convertProcessModelToPublicType(identity, processModel);
      });

    const paginizedProcessModels = applyPagination(managementApiProcessModels, offset, limit);
    return {
      processModels: paginizedProcessModels,
      totalCount: managementApiProcessModels.length,
    };
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    logger.verbose(`Executing getProcessModelById with processModelId '${processModelId}'`);
    const processModel = await this.processModelUseCase.getProcessModelById(identity, processModelId);
    const managementApiProcessModel = await this.convertProcessModelToPublicType(identity, processModel);

    return managementApiProcessModel;
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    logger.verbose(`Executing getProcessModelByProcessInstanceId with processInstanceId '${processInstanceId}'`);
    const processModel = await this.processModelUseCase.getProcessModelByProcessInstanceId(identity, processInstanceId);
    const managementApiProcessModel = await this.convertProcessModelToPublicType(identity, processModel);

    return managementApiProcessModel;
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    logger.verbose(`Executing getStartEventsForProcessModel with processModelId '${processModelId}'`);
    const processModel = await this.processModelUseCase.getProcessModelById(identity, processModelId);
    const processModelFacade = this.processModelFacadeFactory.create(processModel);

    const startEvents = processModelFacade
      .getStartEvents()
      .map(this.convertToPublicEvent);

    const eventList = {
      events: startEvents,
      totalCount: startEvents.length,
    };

    return eventList;
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload?: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType =
    DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    logger.verbose(`Executing startProcessInstance with processModelId '${processModelId}'`);
    let startCallbackTypeToUse = startCallbackType;

    const useDefaultStartCallbackType: boolean = startCallbackTypeToUse === undefined;
    if (useDefaultStartCallbackType) {
      startCallbackTypeToUse = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    if (!Object.values(DataModels.ProcessModels.StartCallbackType).includes(startCallbackTypeToUse)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackTypeToUse} is not a valid return option!`);
    }

    const correlationIdIsGiven: boolean = payload && payload.correlationId !== undefined;
    const correlationId: string = correlationIdIsGiven ? payload.correlationId : uuid.v4();

    // Execution of the ProcessModel will still be done with the requesting users identity.
    const response: DataModels.ProcessModels.ProcessStartResponsePayload =
      await this.executeProcessInstance(identity, correlationId, processModelId, startEventId, payload, startCallbackTypeToUse, endEventId);

    return response;
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {
    logger.verbose(`Executing startProcessInstance with name '${name}'`);

    logger.verbose('Persisting ProcessModel...');
    await this.processModelUseCase.persistProcessDefinitions(identity, name, payload.xml, payload.overwriteExisting);

    // NOTE: This will only work as long as ProcessDefinitionName and ProcessModelId remain the same.
    // As soon as we refactor the ProcessEngine core to allow different names for each, this will have to be refactored accordingly.
    logger.verbose('Checking ProcessModel for Cronjobs');
    const processModel = await this.processModelUseCase.getProcessModelById(identity, name);

    this.cronjobService.addOrUpdate(processModel);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    await this.processModelUseCase.deleteProcessModel(identity, processModelId);

    await this.cronjobService.remove(processModelId);
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {
    logger.verbose(`Executing terminateProcessInstance with processInstanceId '${processInstanceId}'`);

    await this.ensureUserHasClaim(identity, 'can_terminate_process');

    // We query the ProcessInstance to make sure that the requesting user is authorized to access it in the first place.
    // Will throw a 404, if the ProcessInstance does not exist, or the user doesn't have access to it.
    // This is intentional, to hide the existence of the ProcessInstance from users that shouldn't know about it.
    await this.correlationService.getByProcessInstanceId(identity, processInstanceId);

    const terminateEvent = Messages.EventAggregatorSettings.messagePaths.terminateProcessInstance
      .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, processInstanceId);

    const eventPayload = {
      terminatedBy: identity,
    };

    this.eventAggregator.publish(terminateEvent, eventPayload);
  }

  // Notifications
  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessError(identity, callback, subscribeOnce);
  }

  private async convertProcessModelToPublicType(identity: IIdentity, processModel: Model.Process): Promise<DataModels.ProcessModels.ProcessModel> {

    const processModelFacade = this.processModelFacadeFactory.create(processModel);

    let consumerApiStartEvents: Array<DataModels.Events.Event> = [];
    let consumerApiEndEvents: Array<DataModels.Events.Event> = [];

    const processModelIsExecutable = processModelFacade.getIsExecutable();

    if (processModelIsExecutable) {
      const startEvents = processModelFacade.getStartEvents();
      consumerApiStartEvents = startEvents.map(this.convertToPublicEvent);

      const endEvents = processModelFacade.getEndEvents();
      consumerApiEndEvents = endEvents.map(this.convertToPublicEvent);
    }

    const processModelRaw = await this.getRawXmlForProcessModelById(identity, processModel.id);

    const processModelResponse: DataModels.ProcessModels.ProcessModel = {
      id: processModel.id,
      xml: processModelRaw,
      startEvents: consumerApiStartEvents,
      endEvents: consumerApiEndEvents,
    };

    return processModelResponse;
  }

  private async getRawXmlForProcessModelById(identity: IIdentity, processModelId: string): Promise<string> {
    const processModelRaw = await this.processModelUseCase.getProcessDefinitionAsXmlByName(identity, processModelId);

    return processModelRaw.xml;
  }

  private convertToPublicEvent(event: Model.Events.StartEvent): DataModels.Events.Event {
    const managementApiEvent = new DataModels.Events.Event();
    managementApiEvent.id = event.id;
    managementApiEvent.eventName = event.name;
    managementApiEvent.bpmnType = event.bpmnType;
    managementApiEvent.eventType = event.eventType;

    return managementApiEvent;
  }

  private async executeProcessInstance(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    startEventId: string,
    payload?: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const response: DataModels.ProcessModels.ProcessStartResponsePayload = {
      correlationId: correlationId,
      processInstanceId: undefined,
    };

    const inputValuesAreGiven = payload && payload.inputValues !== undefined;
    const inputValues = inputValuesAreGiven ? payload.inputValues : undefined;

    const callerIdIsGiven = payload && payload.callerId !== undefined;
    const callerId = callerIdIsGiven ? payload.callerId : undefined;

    // Only start the process instance and return
    const resolveImmediatelyAfterStart: boolean = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    if (resolveImmediatelyAfterStart) {
      const startResult: ProcessStartedMessage =
        await this.executeProcessService.start(identity, processModelId, correlationId, startEventId, inputValues, callerId);

      response.processInstanceId = startResult.processInstanceId;

      return response;
    }

    let processEndedMessage: EndEventReachedMessage;

    // Start the process instance and wait for a specific end event result
    const resolveAfterReachingSpecificEndEvent: boolean = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached;
    if (resolveAfterReachingSpecificEndEvent) {

      processEndedMessage = await this
        .executeProcessService
        .startAndAwaitSpecificEndEvent(identity, processModelId, correlationId, endEventId, startEventId, inputValues, callerId);

      response.endEventId = processEndedMessage.flowNodeId;
      response.tokenPayload = processEndedMessage.currentToken;
      response.processInstanceId = processEndedMessage.processInstanceId;

      return response;
    }

    // Start the process instance and wait for the first end event result
    processEndedMessage = await this
      .executeProcessService
      .startAndAwaitEndEvent(identity, processModelId, correlationId, startEventId, inputValues, callerId);

    response.endEventId = processEndedMessage.flowNodeId;
    response.tokenPayload = processEndedMessage.currentToken;
    response.processInstanceId = processEndedMessage.processInstanceId;

    return response;
  }

  private async ensureUserHasClaim(identity: IIdentity, claimName: string): Promise<void> {

    const userIsSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);
    if (userIsSuperAdmin) {
      return;
    }

    await this.iamService.ensureHasClaim(identity, claimName);
  }

  private async checkIfUserIsSuperAdmin(identity: IIdentity): Promise<boolean> {
    try {
      const superAdminClaim = 'can_manage_process_instances';
      await this.iamService.ensureHasClaim(identity, superAdminClaim);

      return true;
    } catch (error) {
      return false;
    }
  }

}
