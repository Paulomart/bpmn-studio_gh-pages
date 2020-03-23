/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as moment from 'moment';
import * as uuid from 'node-uuid';
import * as io from 'socket.io-client';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IHttpClient, IRequestOptions} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IManagementApiAccessor,
  IManagementSocketIoAccessor,
  Messages,
  restSettings,
  socketSettings,
} from '@process-engine/management_api_contracts';

/**
 * Associates a Socket with a userId taken from an IIdentity.
 */
type IdentitySocketCollection = {[userId: string]: SocketIOClient.Socket};

/**
 * Connects a Subscription ID to a specific callback.
 * This allows us to remove that Subscription from SocketIO
 * when "ExternalAccessor.removeSubscription" is called.
 */
type SubscriptionCallbackAssociation = {[subscriptionId: string]: any};

export class ExternalAccessor implements IManagementApiAccessor, IManagementSocketIoAccessor {

  public config: any;

  private baseUrl = 'api/management/v1';

  private socketCollection: IdentitySocketCollection = {};
  private subscriptionCollection: SubscriptionCallbackAssociation = {};

  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  public initializeSocket(identity: IIdentity): void {
    this.createSocketForIdentity(identity);
  }

  public disconnectSocket(identity: IIdentity): void {
    this.removeSocketForIdentity(identity);
  }

  // Notifications
  public async onActivityReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(identity, socketSettings.paths.activityReached, callback, subscribeOnce);
  }

  public async onActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(identity, socketSettings.paths.activityFinished, callback, subscribeOnce);
  }

  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(identity, socketSettings.paths.emptyActivityWaiting, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(identity, socketSettings.paths.emptyActivityFinished, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    const socketEventName: string = socketSettings.paths.emptyActivityForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    const socketEventName: string = socketSettings.paths.emptyActivityForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.userTaskWaiting, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.userTaskFinished, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.userTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.userTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.boundaryEventTriggered, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.intermediateThrowEventTriggered, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.intermediateCatchEventReached, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.intermediateCatchEventFinished, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.manualTaskWaiting, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.manualTaskFinished, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.manualTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.manualTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processStarted, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const eventName: string = socketSettings.paths.processInstanceStarted
      .replace(socketSettings.pathParams.processModelId, processModelId);

    return this.createSocketIoSubscription(identity, eventName, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processTerminated, callback, subscribeOnce);
  }

  public async onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processError, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processEnded, callback, subscribeOnce);
  }

  public async onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.cronjobCreated, callback, subscribeOnce);
  }

  public async onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.cronjobExecuted, callback, subscribeOnce);
  }

  public async onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.cronjobStopped, callback, subscribeOnce);
  }

  public async onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.cronjobUpdated, callback, subscribeOnce);
  }

  public async onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.cronjobRemoved, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {

    const socketForIdentity = this.getSocketForIdentity(identity);
    if (!socketForIdentity) {
      return;
    }

    const callbackToRemove = this.subscriptionCollection[subscription.id];
    if (!callbackToRemove) {
      return;
    }

    socketForIdentity.off(subscription.eventName, callbackToRemove);

    delete this.subscriptionCollection[subscription.id];
  }

  // Correlations
  public async getAllCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.buildUrl(restSettings.paths.getAllCorrelations, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.CorrelationList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.buildUrl(restSettings.paths.getActiveCorrelations, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.CorrelationList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths
      .getCorrelationById
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationsByProcessModelId(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getCorrelationsByProcessModelId
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.CorrelationList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstanceById(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.ProcessInstance> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getProcessInstanceById
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.ProcessInstance>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstancesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getProcessInstancesForCorrelation
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.ProcessInstanceList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstancesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getProcessInstancesForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.ProcessInstanceList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstancesByState(
    identity: IIdentity,
    state: DataModels.Correlations.CorrelationState,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getProcessInstancesByState
      .replace(restSettings.params.processInstanceState, state);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.ProcessInstanceList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // Cronjobs
  public async getAllActiveCronjobs(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.buildUrl(restSettings.paths.getActiveCronjobs, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Cronjobs.CronjobList>(url, requestAuthHeaders);

    const resultIsNoCronjobList: boolean = httpResponse.result.cronjobs === undefined;

    const cronjobs = resultIsNoCronjobList ? httpResponse.result as any : httpResponse.result.cronjobs;
    // We need to restore the datatype of `nextExecution`, since that property gets stringified when transported over http.
    const mappedCronjobs = cronjobs.map((entry): DataModels.Cronjobs.CronjobConfiguration => {
      const mappedEntry = entry;
      if (entry.nextExecution) {
        mappedEntry.nextExecution = moment(entry.nextExecution).toDate();
      }

      return mappedEntry;
    });

    if (resultIsNoCronjobList) {
      return mappedCronjobs;
    }

    const result = new DataModels.Cronjobs.CronjobList();

    result.cronjobs = mappedCronjobs;
    result.totalCount = httpResponse.result.totalCount;

    return result;
  }

  public async getCronjobExecutionHistoryForProcessModel(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    let url = restSettings.paths.getCronjobExecutionHistoryForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    if (startEventId) {
      url = `${url}?start_event_id=${startEventId}`;
    }

    url = this.buildUrl(url, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Cronjobs.CronjobHistoryList>(url, requestAuthHeaders);

    const resultIsNoCronjobHistoryList: boolean = httpResponse.result.cronjobHistories === undefined;

    const cronjobHistories = resultIsNoCronjobHistoryList ? httpResponse.result as any : httpResponse.result.cronjobHistories;

    // We need to restore the datatype of `executedAt`, since that property gets stringified when transported over http.
    const mappedCronjobHistories = cronjobHistories.map((entry): DataModels.Cronjobs.CronjobHistoryEntry => {
      const mappedEntry = entry;
      if (entry.executedAt) {
        mappedEntry.executedAt = moment(entry.executedAt).toDate();
      }

      return mappedEntry;
    });

    if (resultIsNoCronjobHistoryList) {
      return mappedCronjobHistories;
    }

    const result = new DataModels.Cronjobs.CronjobHistoryList();

    result.cronjobHistories = mappedCronjobHistories;
    result.totalCount = httpResponse.result.totalCount;

    return result;
  }

  public async getCronjobExecutionHistoryForCrontab(
    identity: IIdentity,
    crontab: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.buildUrl(restSettings.paths.getCronjobExecutionHistoryForCrontab, offset, limit)
      .replace(restSettings.params.crontab, crontab);

    const httpResponse = await this.httpClient.get<DataModels.Cronjobs.CronjobHistoryList>(url, requestAuthHeaders);

    const resultIsNoCronjobHistoryList: boolean = httpResponse.result.cronjobHistories === undefined;

    const cronjobHistories = resultIsNoCronjobHistoryList ? httpResponse.result as any : httpResponse.result.cronjobHistories;

    // We need to restore the datatype of `executedAt`, since that property gets stringified when transported over http.
    const mappedCronjobHistories = cronjobHistories.map((entry): DataModels.Cronjobs.CronjobHistoryEntry => {
      const mappedEntry = entry;
      if (entry.executedAt) {
        mappedEntry.executedAt = moment(entry.executedAt).toDate();
      }

      return mappedEntry;
    });

    if (resultIsNoCronjobHistoryList) {
      return mappedCronjobHistories;
    }

    const result = new DataModels.Cronjobs.CronjobHistoryList();

    result.cronjobHistories = mappedCronjobHistories;
    result.totalCount = httpResponse.result.totalCount;

    return result;
  }

  // ProcessModels
  public async getProcessModels(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ProcessModels.ProcessModelList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.buildUrl(restSettings.paths.processModels, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelByProcessInstanceId.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload?: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const url = this.buildStartProcessInstanceUrl(processModelId, startEventId, startCallbackType, endEventId);

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const httpResponse =
      // eslint-disable-next-line max-len
      await this.httpClient.post<DataModels.ProcessModels.ProcessStartRequestPayload, DataModels.ProcessModels.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelStartEvents.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.updateProcessDefinitionsByName.replace(restSettings.params.processDefinitionsName, name);
    const url = this.buildUrl(restPath);

    await this.httpClient.post<DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.deleteProcessDefinitionsByProcessModelId.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(restPath);

    await this.httpClient.get(url, requestAuthHeaders);
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.terminateProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.buildUrl(restPath);

    await this.httpClient.post(url, {}, requestAuthHeaders);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelEmptyActivities
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processInstanceEmptyActivities
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.correlationEmptyActivities
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelCorrelationEmptyActivities
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    let url = restSettings.paths.finishEmptyActivity
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.emptyActivityInstanceId, emptyActivityInstanceId);

    url = this.buildUrl(url);

    const body: {} = {};
    await this.httpClient.post(url, body, requestAuthHeaders);
  }

  // Events
  public async getWaitingEventsForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.waitingProcessModelEvents.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.waitingCorrelationEvents.replace(restSettings.params.correlationId, correlationId);
    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.waitingProcessModelCorrelationEvents
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.triggerMessageEvent
      .replace(restSettings.params.eventName, messageName);

    const url = this.buildUrl(restPath);

    await this.httpClient.post<DataModels.Events.EventTriggerPayload, void>(url, payload, requestAuthHeaders);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.triggerSignalEvent
      .replace(restSettings.params.eventName, signalName);

    const url = this.buildUrl(restPath);

    await this.httpClient.post<DataModels.Events.EventTriggerPayload, void>(url, payload, requestAuthHeaders);
  }

  // FlowNodeInstances
  public async getFlowNodeInstancesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.FlowNodeInstanceList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getFlowNodeInstancesForProcessInstance.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.FlowNodeInstances.FlowNodeInstanceList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // Tasks
  public async getAllSuspendedTasks(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPath = restSettings.paths.allSuspendedTasks;
    const url = this.buildUrl(urlRestPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.FlowNodeInstances.TaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getSuspendedTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPath = restSettings.paths.suspendedProcessModelTasks.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(urlRestPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.FlowNodeInstances.TaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getSuspendedTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPath = restSettings.paths.suspendedProcessInstanceTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.buildUrl(urlRestPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.FlowNodeInstances.TaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getSuspendedTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPath = restSettings.paths.suspendedCorrelationTasks.replace(restSettings.params.correlationId, correlationId);
    const url = this.buildUrl(urlRestPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.FlowNodeInstances.TaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getSuspendedTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.FlowNodeInstances.TaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPath = restSettings.paths.suspendedProcessModelCorrelationTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(urlRestPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.FlowNodeInstances.TaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // ManualTasks
  public async getManualTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.processModelManualTasks.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(urlRestPart, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.processInstanceManualTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.buildUrl(urlRestPart, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.correlationManualTasks.replace(restSettings.params.correlationId, correlationId);
    const url = this.buildUrl(urlRestPart, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.processModelCorrelationManualTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(urlRestPart, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.finishManualTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.manualTaskInstanceId, manualTaskInstanceId);

    const url = this.buildUrl(urlRestPart);

    await this.httpClient.post(url, {}, requestAuthHeaders);
  }

  // UserTasks
  public async getUserTasksForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelUserTasks.replace(restSettings.params.processModelId, processModelId);
    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processInstanceUserTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.finishUserTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskInstanceId, userTaskInstanceId);

    const url = this.buildUrl(restPath);

    await this.httpClient.post<DataModels.UserTasks.UserTaskResult, void>(url, userTaskResult, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformationList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.FlowNodeRuntimeInformationList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.ActiveTokenList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.ActiveTokenList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.ActiveTokenList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(
    identity: IIdentity,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.ActiveTokenList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelLog(
    identity: IIdentity,
    processModelId: string,
    correlationId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    let restPath = restSettings.paths.getProcessModelLog
      .replace(restSettings.params.processModelId, processModelId);

    if (correlationId) {
      restPath = `${restPath}?${restSettings.queryParams.correlationId}=${correlationId}`;
    }

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Logging.LogEntryList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getProcessInstanceLog
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.Logging.LogEntryList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNode(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.TokenHistory.TokenHistoryEntryList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForFlowNode
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.buildUrl(restPath, offset, limit);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryEntryList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNodeByProcessInstanceId(
    identity: IIdentity,
    processInstanceId: string,
    flowNodeId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForFlowNodeByProcessInstanceId
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.buildUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private buildStartProcessInstanceUrl(
    processModelId: string,
    startEventId: string,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId: string,
  ): string {

    let restPath = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId);

    restPath = `${restPath}?start_callback_type=${startCallbackType}`;

    const startEventIdGiven = startEventId !== undefined;
    if (startEventIdGiven) {
      restPath = `${restPath}&${restSettings.queryParams.startEventId}=${startEventId}`;
    }

    if (startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached) {
      restPath = `${restPath}&${restSettings.queryParams.endEventId}=${endEventId}`;
    }

    const url = this.buildUrl(restPath);

    return url;
  }

  private createRequestAuthHeaders(identity: IIdentity): IRequestOptions {

    const authTokenNotProvided = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      return {};
    }

    const requestAuthHeaders = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private buildUrl(url: string, offset: number = 0, limit: number = 0): string {
    let finalUrl = `${this.baseUrl}${url}`;

    if (finalUrl.indexOf('?') > 0) {
      finalUrl = `${finalUrl}&offset=${offset}&limit=${limit}`;
    } else {
      finalUrl = `${finalUrl}?offset=${offset}&limit=${limit}`;
    }

    return finalUrl;
  }

  private createSocketIoSubscription(identity: IIdentity, route: string, callback: any, subscribeOnce: boolean): Subscription {

    const socketForIdentity = this.createSocketForIdentity(identity);

    if (subscribeOnce) {
      socketForIdentity.once(route, callback);
    } else {
      socketForIdentity.on(route, callback);
    }

    const subscriptionId = uuid.v4();
    const subscription = new Subscription(subscriptionId, route, subscribeOnce);

    this.subscriptionCollection[subscriptionId] = callback;

    return subscription;
  }

  private createSocketForIdentity(identity: IIdentity): SocketIOClient.Socket {

    const existingSocket = this.getSocketForIdentity(identity);
    if (existingSocket) {
      return existingSocket;
    }

    const noAuthTokenProvided = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const socketUrl = `${this.config.socketUrl}/${socketSettings.namespace}`;
    const socketIoOptions: SocketIOClient.ConnectOpts = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: identity.token,
          },
        },
      },
    };

    this.socketCollection[identity.userId] = io(socketUrl, socketIoOptions);

    return this.socketCollection[identity.userId];
  }

  private removeSocketForIdentity(identity: IIdentity): void {
    const socketForIdentity = this.getSocketForIdentity(identity);

    const noSocketFound = !socketForIdentity;
    if (noSocketFound) {
      return;
    }
    socketForIdentity.disconnect();
    socketForIdentity.close();

    delete this.socketCollection[identity.userId];
  }

  private getSocketForIdentity(identity: IIdentity): SocketIOClient.Socket {
    return this.socketCollection[identity.userId];
  }

}
