import {IInstanceWrapper, Resolver} from 'addict-ioc';

export class ConfigResolver extends Resolver<any, IInstanceWrapper<any>> {

  public readonly nconf: any;

  constructor(nconf: any) {
    super();
    this.nconf = nconf;
  }

  public resolveConfig(configNamespace: Function | {} | string): any {

    const configType: string = typeof configNamespace;

    switch (configType) {
      case 'function':
        return (configNamespace as Function)();
      case 'object':
        return configNamespace;
      case 'string':
        return this.nconf.get(configNamespace);
      default:
        return undefined;
    }
  }

}
