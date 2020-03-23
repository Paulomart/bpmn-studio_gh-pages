import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels, Messages} from '@process-engine/management_api_contracts';
import {ICronjobService} from '@process-engine/process_engine_contracts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';

import {ICronjobHistoryService} from '@process-engine/persistence_api.contracts';

import {NotificationAdapter} from './adapters/index';
import {applyPagination} from './paginator';

export class CronjobService implements APIs.ICronjobManagementApi {

  private readonly iamService: IIAMService;
  private readonly notificationAdapter: NotificationAdapter;
  private readonly cronjobService: ICronjobService;
  private readonly cronjobHistoryService: ICronjobHistoryService;

  private readonly canSubscribeToEventsClaim = 'can_subscribe_to_events';

  constructor(
    cronjobService: ICronjobService,
    cronjobHistoryService: ICronjobHistoryService,
    iamService: IIAMService,
    notificationAdapter: NotificationAdapter,
  ) {
    this.cronjobHistoryService = cronjobHistoryService;
    this.cronjobService = cronjobService;
    this.iamService = iamService;
    this.notificationAdapter = notificationAdapter;
  }

  public async getAllActiveCronjobs(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobList> {

    const cronjobs = this.cronjobService.getActive();

    const paginizedCronjobs = applyPagination(cronjobs, offset, limit);

    return {cronjobs: paginizedCronjobs, totalCount: cronjobs.length};
  }

  public async getCronjobExecutionHistoryForProcessModel(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {
    const cronjobHistories = await this.cronjobHistoryService.getByProcessModelId(identity, processModelId, startEventId);

    const paginizedCronjobHistories = applyPagination(cronjobHistories, offset, limit);

    return {cronjobHistories: paginizedCronjobHistories, totalCount: cronjobHistories.length};
  }

  public async getCronjobExecutionHistoryForCrontab(
    identity: IIdentity,
    crontab: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Cronjobs.CronjobHistoryList> {
    const cronjobHistories = await this.cronjobHistoryService.getByCrontab(identity, crontab);

    const paginizedCronjobHistories = applyPagination(cronjobHistories, offset, limit);

    return {cronjobHistories: paginizedCronjobHistories, totalCount: cronjobHistories.length};
  }

  public async onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobCreated(identity, callback, subscribeOnce);
  }

  public async onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobExecuted(identity, callback, subscribeOnce);
  }

  public async onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobStopped(identity, callback, subscribeOnce);
  }

  public async onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobUpdated(identity, callback, subscribeOnce);
  }

  public async onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    await this.iamService.ensureHasClaim(identity, this.canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobRemoved(identity, callback, subscribeOnce);
  }

}
