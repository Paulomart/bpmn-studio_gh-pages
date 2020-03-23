import { ConventionCallType, IContainerSettings } from './interfaces';
import { Resolver } from './resolver';

export const defaultSettings: IContainerSettings = {
  defaults: {
    isSingleton: false,
    isTrueSingleton: false,
    wantsInjection: true,
    dependencies: [],
    lazyDependencies: [],
    lazyDependenciesAsync: [],
    ownedDependencies: [],
    functionsToBind: [],
    overwrittenKeys: {},
    overwrittenConventionCalls: {},
    injectConventionCalled: {},
    // isLazy: false,
    // bindFunctions: false,
    // autoCreateMissingSubscribers: true
  },
  resolver: new Resolver(),
  containerRegistrationKey: 'container',
  circularDependencyCanIncludeSingleton: true,
  circularDependencyCanIncludeLazy: true,
  conventionCallTypes: [ConventionCallType.Class],
};
