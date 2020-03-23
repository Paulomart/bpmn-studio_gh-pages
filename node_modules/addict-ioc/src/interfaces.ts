// tslint:disable:no-empty-interface

export interface IContainer<TInstanceWrapper extends IInstanceWrapper<any> = IInstanceWrapper<any>> extends IRegistry {
  instances: IInstanceCache<any, TInstanceWrapper>;
  parentContainer: IContainer<any>;
  settings: IContainerSettings;
  clear(): void;
  initialize(): void;
  resolve<TType>(key: RegistrationKey, injectionArgs?: Array<any>, config?: any): TType;
  resolveLazy<TType>(key: RegistrationKey, injectionArgs?: Array<any>, config?: any): IFactory<TType>;
  resolveAsync<TType>(key: RegistrationKey, injectionArgs?: Array<any>, config?: any): Promise<TType>;
  resolveLazyAsync<TType>(key: RegistrationKey, injectionArgs?: Array<any>, config?: any): IFactoryAsync<TType>;
  validateDependencies(...keys: Array<RegistrationKey>): Array<string>;
}

// export interface IInstanceCache<T> extends Map<RegistrationKey, IInstanceWithConfigCache<T>> {}
// export interface IInstanceWithConfigCache<T> extends Map<string, IInstanceWithInjectionArgsCache<T>> {}
// export interface IInstanceWithInjectionArgsCache<T> extends Map<string, Array<T>> {}

export interface IInstanceCache<TType, TInstanceWrapper extends IInstanceWrapper<TType>> {
  [key: string]: any | {
    [configHash: string]: {
      [injectionArgsHash: string]: Array<TType>;
    },
  };
}

export interface IInstanceLookup<TInstanceWrapper extends IInstanceWrapper<any>> {
  [instanceId: string]: TInstanceWrapper;
}

export interface IValidationError {
  errorMessage: string;
  registrationStack: Array<IRegistration>;
  currentRegistration: IRegistration;
}

export interface IValidationResults {
  order: Array<RegistrationKey>;
  missing: Array<RegistrationKey>;
  recursive: Array<Array<RegistrationKey>>;
}

export interface IRegistrator {
  createRegistrationTemplate(registrationSettings: IRegistrationSettings): IRegistrator;
  register<TType, TRegistrationSettings extends IRegistrationSettings = ITypeRegistrationSettings<TType>>(key: RegistrationKey, type: Type<TType>, settings?: TRegistrationSettings): ITypeRegistration<TType>;
  registerObject<TType, TRegistrationSettings extends IRegistrationSettings = IObjectRegistrationSettings<TType>>(key: RegistrationKey, object: TType, settings?: TRegistrationSettings): IObjectRegistration<TType>;
  registerFactory<TType, TRegistrationSettings extends IRegistrationSettings = IFactoryRegistrationSettings<TType>>(key: RegistrationKey, factory: TType, settings?: TRegistrationSettings): IFactoryRegistration<TType>;
  unregister<TType>(key: RegistrationKey): IRegistration | ITypeRegistration<TType>;
}

export interface IRegistry extends IRegistrator {
  importRegistrations(registrationSettings: Array<IRegistrationSettings>): void;
  exportRegistrations(keysToExport: Array<RegistrationKey>): Array<IRegistrationSettings>;
  isRegistered(key: RegistrationKey): boolean;
  getRegistration(key: RegistrationKey): IRegistration;
  getKeysByTags(...tags: Array<ITags | string>): Array<RegistrationKey>;
}

export interface ISpecializedRegistration<TRegistration extends IRegistration, TRegistrationSettings extends IRegistrationSettings> extends IRegistration {
  settings: TRegistrationSettings;
  configure(config: any): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  dependencies(...dependencies: Array<RegistrationKey>): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  singleton(isSingleton?: boolean): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  isTrueSingleton(): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  transient(isTransient?: boolean): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  injectLazy(...lazyDependencies: Array<RegistrationKey>): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  injectPromiseLazy(...lazyDependencies: Array<RegistrationKey>): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  injectInto(targetFunction: string): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  bindFunctions(...functionsToBind: Array<string>): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  owns(...dependencies: Array<RegistrationKey>): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  overwrite(originalKey: string, overwrittenKey: string): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  tags(...tags: Array<string>): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
  setTag(tag: string, value: any): ISpecializedRegistration<TRegistration, TRegistrationSettings>;
}

export interface ITypeRegistration<TType> extends ISpecializedRegistration<ITypeRegistration<TType>, ITypeRegistrationSettings<TType>> { }
export interface IObjectRegistration<TType> extends ISpecializedRegistration<IObjectRegistration<TType>, IObjectRegistrationSettings<TType>> { }
export interface IFactoryRegistration<TType> extends ISpecializedRegistration<IFactoryRegistration<TType>, IFactoryRegistrationSettings<TType>> { }

export interface IRegistration {
  settings: IRegistrationSettings;
}

export interface ITypeRegistrationSettings<TType> extends IRegistrationSettings {
  type?: Type<TType>;
}

export interface IObjectRegistrationSettings<TType> extends IRegistrationSettings {
  object?: TType;
}

export interface IFactoryRegistrationSettings<TType> extends IRegistrationSettings {
  factory?: TType;
}

export interface IConfigResolver {
  (config: string | any): any;
}

export type TypeConfig = string | any | IConfigResolver;

export interface IContainerSettings extends IRegistrationSettings {
  containerRegistrationKey?: RegistrationKey;
  circularDependencyCanIncludeSingleton?: boolean;
  circularDependencyCanIncludeLazy?: boolean;
  conventionCallTypes?: Array<ConventionCallType>;
}

export enum ConventionCallType {
  Class,
  Object,
  Factory,
}

export interface IRegistrationSettings {
  defaults?: IRegistrationSettings;
  resolver?: IResolver<any, IInstanceWrapper<any>>;
  key?: RegistrationKey;
  object?: any;
  factory?: any;
  isFactory?: boolean;
  module?: string;
  isObject?: boolean;
  dependencies?: Array<RegistrationKey>;
  ownedDependencies?: Array<RegistrationKey>;
  tags?: ITags;
  config?: TypeConfig;
  isSingleton?: boolean;
  isTrueSingleton?: boolean;
  wantsInjection?: boolean;
  injectInto?: string;
  bindFunctions?: boolean;
  functionsToBind?: Array<string>;
  wantsLazyInjection?: boolean;
  lazyDependencies?: Array<string>;
  wantsLazyInjectionAsync?: boolean;
  lazyDependenciesAsync?: Array<string>;
  overwrittenKeys?: IOverwrittenKeys;
  conventionCalls?: Array<string>;
  overwrittenConventionCalls?: IOverwrittenConventionCalls;
  injectConventionCalled?: IInjectConventionCalled;
  // autoCreateMissingSubscribers?: boolean;
  // subscriptions?: IHookSubscriptions;

}

export interface IInjectConventionCalled {
  [registrationKey: string]: string;
}

export interface IOverwrittenConventionCalls {
  [overwrittenConventionCall: string]: string;
}

export interface IConventionCalls {
  [dependencyKey: string]: IConventionCall;
}

export interface IConventionCall {
  [call: string]: string;

}

export interface IOverwrittenKeys {
  [originalKey: string]: string;
}

export interface IResolver<TType, TInstanceWrapper extends IInstanceWrapper<any>> {
  resolveType<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, registration: ITypeRegistration<TExtendedType>): Type<TExtendedType>;
  resolveTypeAsync<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, registration: ITypeRegistration<TExtendedType>): Promise<Type<TExtendedType>>;
  resolveObject<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, registration: IRegistration): TExtendedType;
  resolveObjectAsync<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, registration: IRegistration): Promise<TExtendedType>;
  resolveFactory<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, registration: IRegistration): TExtendedType;
  resolveFactoryAsync<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, registration: IRegistration): Promise<TExtendedType>;
  createInstance<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, type: any, registration: ITypeRegistration<TExtendedType>, dependencies: Array<any>, injectionArgs?: Array<any>): TExtendedType;
  createObject<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, object: any, registration: ITypeRegistration<TExtendedType>, dependencies: Array<any>, injectionArgs?: Array<any>): TExtendedType;
  createFactory<TExtendedType extends TType = TType>(container: IContainer<TInstanceWrapper>, type: any, registration: ITypeRegistration<TExtendedType>, dependencies: Array<any>, injectionArgs?: Array<any>): TExtendedType;
  resolveConfig(config: TypeConfig): any;
  hash(anything: any): string;
  hashType<TExtendedType extends TType = TType>(type: Type<TExtendedType>): string;
  hashObject<TExtendedType extends TType = TType>(object: TExtendedType): string;
  hashFactory<TExtendedType extends TType = TType>(factory: TExtendedType): string;
  hashConfig(config: any): string;
}

export interface IDependencyOwners {
  [ownedDependencyKey: string]: ITypeRegistration<any>;
}

export interface IFactory<TType> {
  (injectionArgs?: Array<any>, runtimeConfig?: any): TType;
}

export interface IFactoryAsync<TType> {
  (injectionArgs?: Array<any>, runtimeConfig?: any): Promise<TType>;
}

export type RegistrationKey = string;

export interface ITags {
  [tag: string]: any;
}

export interface Type<TType> {
  new (...args: Array<any>): TType;
}
export interface IInvocationContext {
  [conventionCall: string]: string;
}

export interface IInstanceWrapper<TType> {
  id?: InstanceId;
  ownedBy?: InstanceId;
  instance?: TType;
  ownedInstances: Array<InstanceId>;
  registration: IRegistration;
  invoked: Array<string>;
}

export interface IInvocationWrapper<TType> extends IInstanceWrapper<TType> {
  invocations: IInvocationContext;
}

export type InstanceId = string;

export interface IResolutionContext<TType, TInstanceWrapper extends IInstanceWrapper<TType>> {
  currentResolution: TInstanceWrapper;
  instanceLookup: IInstanceLookup<TInstanceWrapper>;
  instanceResolutionOrder: Array<TInstanceWrapper>;
}

export interface IInvocationResolutionContext<TType> extends IResolutionContext<TType, IInvocationWrapper<TType>> {
  invocations: Array<TType>;
}
