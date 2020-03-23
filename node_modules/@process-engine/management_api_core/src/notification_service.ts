import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {APIs, Messages} from '@process-engine/management_api_contracts';

import {NotificationAdapter} from './adapters/index';

const superAdminClaim = 'can_manage_process_instances';
const canSubscribeToEventsClaim = 'can_subscribe_to_events';

export class NotificationService implements APIs.INotificationManagementApi {

  private readonly iamService: IIAMService;
  private readonly notificationAdapter: NotificationAdapter;

  constructor(
    iamService: IIAMService,
    notificationAdapter: NotificationAdapter,
  ) {
    this.iamService = iamService;
    this.notificationAdapter = notificationAdapter;
  }

  // Notifications
  public async onActivityReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onActivityReached(identity, callback, subscribeOnce);
  }

  public async onActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onBoundaryEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onIntermediateThrowEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onIntermediateCatchEventReached(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onIntermediateCatchEventFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    processModelId: string,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessError(identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async onCronjobCreated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobCreatedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobCreated(identity, callback, subscribeOnce);
  }

  public async onCronjobExecuted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobExecutedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobExecuted(identity, callback, subscribeOnce);
  }

  public async onCronjobStopped(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobStoppedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobStopped(identity, callback, subscribeOnce);
  }

  public async onCronjobUpdated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobUpdatedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobUpdated(identity, callback, subscribeOnce);
  }

  public async onCronjobRemoved(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCronjobRemovedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription> {
    await this.ensureHasClaim(identity, canSubscribeToEventsClaim);

    return this.notificationAdapter.onCronjobRemoved(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    return this.notificationAdapter.removeSubscription(subscription);
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

}
