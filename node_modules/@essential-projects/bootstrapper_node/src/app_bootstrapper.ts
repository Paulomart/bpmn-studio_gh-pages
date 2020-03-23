/* eslint-disable @typescript-eslint/member-naming */
import {ExtensionBootstrapper} from '@essential-projects/bootstrapper';
import {extensionDiscoveryTag} from '@essential-projects/bootstrapper_contracts';
import {Container, IFactoryAsync, IInstanceWrapper} from 'addict-ioc';
import * as nconf from 'nconf';
import * as path from 'path';
import {ConfigResolver} from './config_resolver';

export class AppBootstrapper {

  public readonly appRoot = process.cwd();
  public readonly env = process.env.NODE_ENV || 'development';
  public readonly configPath = process.env.CONFIG_PATH || path.resolve(this.appRoot, 'config');

  protected readonly container: Container<IInstanceWrapper<any>>;

  private extensionBootstrapperFactory: IFactoryAsync<ExtensionBootstrapper>;
  private extensionBootstrapper: ExtensionBootstrapper;

  constructor(
    container: Container<IInstanceWrapper<any>>,
    extensionBootstrapperFactory: IFactoryAsync<ExtensionBootstrapper>,
    appRoot?: string,
  ) {
    this.container = container;
    this.extensionBootstrapperFactory = extensionBootstrapperFactory;
    if (appRoot) {
      this.appRoot = path.normalize(appRoot);
    }
  }

  private initializeConfigProvider(): void {

    // nconfetti tries to register itself to nconf
    // (here: https://github.com/5minds/nconfetti/blob/f9eae47cd3a194136b6b06328efcf6f39836c9d3/lib/nconfetti.js#L134)
    // for this to work however, the nconf-instance in nconfetti has to be the
    // same instance we have here in this file. This on the other hand seems to
    // not always be the case. We can still make it work, by manually
    // registering nconfetti to our nconf-instance we have here.
    // eslint-disable-next-line
    (nconf as any).Nconfetti = require('nconfetti');

    nconf.argv()
      .env('__');

    nconf.use('Nconfetti', {path: this.configPath, env: this.env});

    this.container.settings.resolver = new ConfigResolver(nconf);
  }

  public async initialize(): Promise<void> {
    this.extensionBootstrapper = await this.extensionBootstrapperFactory([extensionDiscoveryTag]);

    this.initializeConfigProvider();
  }

  public async start(): Promise<void> {
    await this.extensionBootstrapper.start();
  }

  public async stop(): Promise<void> {
    await this.extensionBootstrapper.stop();
  }

}
