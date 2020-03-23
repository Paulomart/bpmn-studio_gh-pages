import {Container} from './container';
import {
  ConventionCallType,
  IConventionCall,
  IConventionCalls,
  IFactory,
  IFactoryAsync,
  IFactoryRegistration,
  IInjectConventionCalled,
  IInstanceLookup,
  IInvocationContext,
  IInvocationResolutionContext,
  IInvocationWrapper,
  IObjectRegistration,
  IOverwrittenConventionCalls,
  IRegistration,
  IResolutionContext,
  ITypeRegistration,
  RegistrationKey,
} from './interfaces';
import {executeAsExtensionHook as extensionHook, executeAsExtensionHookAsync as extensionHookAsync} from './utils';

export class InvocationContainer extends Container<IInvocationWrapper<any>> {

  public async resolveAsync<TType>(key: RegistrationKey, injectionArgs: Array<any> = [], config?: any): Promise<TType> {

    const registration: IRegistration = this.getRegistration(key);

    if (!registration) {
      throw new Error(`registration for key "${key}" not found`);
    }

    const resolutionContext: IInvocationResolutionContext<TType> = this._createNewResolutionContext<TType>(registration);

    const resolvedInstance: TType = await this._resolveAsync<TType>(registration, resolutionContext, injectionArgs, config);

    await this._performInvocationsAsync<TType>(resolutionContext);

    return resolvedInstance;
  }

  public resolve<TType>(key: RegistrationKey, injectionArgs: Array<any> = [], config?: any): TType {

    const registration: IRegistration = this.getRegistration(key);

    if (!registration) {
      throw new Error(`registration for key "${key}" not found`);
    }

    const resolutionContext: IInvocationResolutionContext<TType> = this._createNewResolutionContext<TType>(registration);

    const resolvedInstance: TType = this._resolve<TType>(registration, resolutionContext, injectionArgs, config);

    this._performInvocations<TType>(resolutionContext);

    return resolvedInstance;
  }

  protected _resolveLazy<TType>(registration: IRegistration, resolutionContext: IInvocationResolutionContext<TType>, injectionArgs: Array<any> = [], config?: any): IFactory<TType> {

    return (lazyInjectionArgs: Array<any>, lazyConfig: any): TType => {

      const lazyResolutionContext: IInvocationResolutionContext<TType> = this._createNewResolutionContext(registration);

      const injectionArgsUsed: Array<any> = this._mergeArguments(injectionArgs, lazyInjectionArgs);

      const lazyConfigUsed: any = this._mergeConfigs(config, lazyConfig);

      const resolvedInstance: TType = this._resolve<TType>(registration, resolutionContext, injectionArgsUsed, lazyConfigUsed);

      this._performInvocations<TType>(lazyResolutionContext);

      return resolvedInstance;
    };
  }

  protected _resolveLazyAsync<TType>(registration: IRegistration, resolutionContext: IInvocationResolutionContext<TType>, injectionArgs: Array<any> = [], config?: any): IFactoryAsync<TType> {

    return async(lazyInjectionArgs: Array<any>, lazyConfig: any): Promise<TType> => {

      const lazyResolutionContext: IInvocationResolutionContext<TType> = this._createNewResolutionContext(registration);

      const injectionArgsUsed: Array<any> = this._mergeArguments(injectionArgs, lazyInjectionArgs);

      const lazyConfigUsed: any = this._mergeConfigs(config, lazyConfig);

      const resolvedInstance: TType = await this._resolveAsync<TType>(registration, lazyResolutionContext, injectionArgsUsed, lazyConfigUsed);

      await this._performInvocationsAsync<TType>(lazyResolutionContext);

      return resolvedInstance;
    };
  }

  protected _createNewResolutionContext<TType>(registration: IRegistration): IInvocationResolutionContext<TType> {
    const newResolutionContext: IResolutionContext<TType, IInvocationWrapper<TType>> = super._createNewResolutionContext<TType>(registration);
    newResolutionContext.currentResolution.invocations = {};
    return newResolutionContext as IInvocationResolutionContext<TType>;
  }

  protected _createChildResolutionContext<TType>(registration: IRegistration, resolutionContext: IInvocationResolutionContext<TType>): IInvocationResolutionContext<TType> {
    const newResolutionContext: IResolutionContext<TType, IInvocationWrapper<TType>> = super._createChildResolutionContext(registration, resolutionContext);
    newResolutionContext.currentResolution.invocations = {};
    return newResolutionContext as IInvocationResolutionContext<TType>;
  }

  protected async _resolveDependencyAsync<TType>(registration: IRegistration, dependencyKey: RegistrationKey, resolutionContext: IInvocationResolutionContext<TType>): Promise<any> {
    const resolvedDependency: TType = await super._resolveDependencyAsync(registration, dependencyKey, resolutionContext);
    this._initializeDependencyInvocationContext(registration, dependencyKey, resolutionContext);
    return resolvedDependency;
  }

  protected _resolveDependency<TType>(registration: IRegistration, dependencyKey: RegistrationKey, resolutionContext: IInvocationResolutionContext<TType>): any {
    const resolvedDependency: TType = super._resolveDependency(registration, dependencyKey, resolutionContext);
    this._initializeDependencyInvocationContext(registration, dependencyKey, resolutionContext);
    return resolvedDependency;
  }

  protected _initializeDependencyInvocationContext<TType>(registration: IRegistration, dependencyKey: RegistrationKey, resolutionContext: IInvocationResolutionContext<TType>): void {

    const parentConventionCalls: IOverwrittenConventionCalls = registration.settings.overwrittenConventionCalls;

    const conventionCalls: Array<string> = this.settings.conventionCalls || this.settings.defaults.conventionCalls;

    const invocations: IInvocationContext = {};

    for (const call of conventionCalls) {

      const callOverwritten: string = parentConventionCalls[call];
      const callUsed: string = callOverwritten || call;

      invocations[call] = callUsed;
    }

    resolutionContext.instanceLookup[resolutionContext.currentResolution.id].invocations = invocations;
  }

  protected async _performInvocationsAsync<TType>(resolutionContext: IInvocationResolutionContext<TType>): Promise<void> {

    const calls: Array<string> = this.settings.conventionCalls || this.settings.defaults.conventionCalls;

    if (!calls || !this._isConventionCallTypeActive(resolutionContext)) {
      return;
    }

    const injectConventionCalled: IInjectConventionCalled = resolutionContext.currentResolution.registration.settings.injectConventionCalled;
    const injectConventionCalledInstances: Array<IInvocationWrapper<TType>> = this._getInjectCalledInstances(resolutionContext);

    for (const wrapper of injectConventionCalledInstances) {

      for (const call of calls) {
        await this._performInvocationAsync(resolutionContext, call, wrapper.id);
      }
    }

    for (const call of calls) {

      const instanceResolutionIndex: number = resolutionContext.instanceResolutionOrder.indexOf(resolutionContext.currentResolution);
      const instanceResolutionOrderIds: Array<string> = resolutionContext.instanceResolutionOrder.map((resolution: IInvocationWrapper<any>) => { return resolution.id; });

      // if (instanceResolutionIndex === -1) {
      //   throw new Error('that shouldn`t happen');
      // }

      const instancesToInvoke: Array<string> = instanceResolutionOrderIds.slice(0, instanceResolutionIndex + 1);

      for (const instanceId of instancesToInvoke) {
        await this._performInvocationAsync(resolutionContext, call, instanceId);
      }
    }
  }

  protected async _performInvocationAsync<TType>(resolutionContext: IInvocationResolutionContext<TType>, call: string, instanceId: string): Promise<void> {

    const instanceWrapper: IInvocationWrapper<TType> = resolutionContext.instanceLookup[instanceId];

    if (instanceWrapper.invoked && instanceWrapper.invoked.indexOf(call) !== -1) {
      return;
    } else {

      if (!instanceWrapper.invoked) {
        instanceWrapper.invoked = [];
      }

      instanceWrapper.invoked.push(call);
    }

    const invocation: string = instanceWrapper.invocations[call] || call;

    // if (invocation === call) {
    //   console.log(`invoking "${invocation}" on key "${instanceWrapper.registration.settings.key}" (instance: ${instanceId})`);
    // } else {
    //   console.log(`invoking "${invocation}" instead of "${call}" on key "${instanceWrapper.registration.settings.key}" (instance: ${instanceId})`);
    // }

    await extensionHookAsync(instanceWrapper.instance[invocation], instanceWrapper.instance);
  }

  private _isConventionCallTypeActive<TType>(resolutionContext: IInvocationResolutionContext<TType>): boolean {

    const registration: IRegistration = resolutionContext.currentResolution.registration;

    if (registration.settings.isFactory) {
      return this.settings.conventionCallTypes.indexOf(ConventionCallType.Factory) !== -1;
    }

    if (registration.settings.isObject) {
      return this.settings.conventionCallTypes.indexOf(ConventionCallType.Object) !== -1;
    }

    return this.settings.conventionCallTypes.indexOf(ConventionCallType.Class) !== -1;
  }

  protected _performInvocations<TType>(resolutionContext: IInvocationResolutionContext<TType>): void {

    const calls: Array<string> = this.settings.conventionCalls || this.settings.defaults.conventionCalls;

    if (!calls || !this._isConventionCallTypeActive(resolutionContext)) {
      return;
    }

    const injectConventionCalled: IInjectConventionCalled = resolutionContext.currentResolution.registration.settings.injectConventionCalled;
    const injectConventionCalledInstances: Array<IInvocationWrapper<TType>> = this._getInjectCalledInstances(resolutionContext);

    for (const wrapper of injectConventionCalledInstances) {

      for (const call of calls) {
        this._performInvocation(resolutionContext, call, wrapper.id);
      }
    }

    for (const call of calls) {

      const isConventionCalled: boolean = !!injectConventionCalled[call];

      if (isConventionCalled) {
        continue;
      }

      const instanceResolutionIndex: number = resolutionContext.instanceResolutionOrder.indexOf(resolutionContext.currentResolution);
      const instanceResolutionOrderIds: Array<string> = resolutionContext.instanceResolutionOrder.map((resolution: IInvocationWrapper<any>) => { return resolution.id; });

      // if (instanceResolutionIndex === -1) {
      //   throw new Error('that shouldn`t happen');
      // }

      const instancesToInvoke: Array<string> = instanceResolutionOrderIds.slice(0, instanceResolutionIndex + 1);

      for (const instanceId of instancesToInvoke) {
        this._performInvocation(resolutionContext, call, instanceId);
      }
    }
  }

  protected _performInvocation<TType>(resolutionContext: IInvocationResolutionContext<TType>, call: string, instanceId: string): void {

    const instanceWrapper: IInvocationWrapper<TType> = resolutionContext.instanceLookup[instanceId];

    if (instanceWrapper.invoked && instanceWrapper.invoked.indexOf(call) !== -1) {
      return;
    } else {

      if (!instanceWrapper.invoked) {
        instanceWrapper.invoked = [];
      }

      instanceWrapper.invoked.push(call);
    }

    const invocation: string = instanceWrapper.invocations[call] || call;

    // if (invocation === call) {
    //   console.log(`invoking "${invocation}" on key "${instanceWrapper.registration.settings.key}" (instance: ${instanceId})`);
    // } else {
    //   console.log(`invoking "${invocation}" instead of "${call}" on key "${instanceWrapper.registration.settings.key}" (instance: ${instanceId})`);
    // }

    extensionHook(instanceWrapper.instance[invocation], instanceWrapper.instance);
  }

  private _getInjectCalledInstances<TType>(resolutionContext: IInvocationResolutionContext<TType>): Array<IInvocationWrapper<TType>> {

    const injectConventionCalled: IInjectConventionCalled = resolutionContext.currentResolution.registration.settings.injectConventionCalled;

    const result: Array<IInvocationWrapper<TType>> = [];

    for (const registrationKey in injectConventionCalled) {

      for (const resolution of resolutionContext.instanceResolutionOrder) {

        const wrapper: IInvocationWrapper<TType> = resolutionContext.instanceLookup[resolution.id];

        if (wrapper.registration.settings.key === registrationKey) {
          result.push(wrapper);
        }
      }
    }

    return result;
  }

}
