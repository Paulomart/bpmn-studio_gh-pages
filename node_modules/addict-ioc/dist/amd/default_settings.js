define(["require", "exports", "./interfaces", "./resolver"], function (require, exports, interfaces_1, resolver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultSettings = {
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
        },
        resolver: new resolver_1.Resolver(),
        containerRegistrationKey: 'container',
        circularDependencyCanIncludeSingleton: true,
        circularDependencyCanIncludeLazy: true,
        conventionCallTypes: [interfaces_1.ConventionCallType.Class],
    };
});

//# sourceMappingURL=default_settings.js.map
