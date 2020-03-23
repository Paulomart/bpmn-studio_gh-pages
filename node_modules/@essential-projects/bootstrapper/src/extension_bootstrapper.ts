/* eslint-disable no-return-await */
import {Container, IInstanceWrapper} from 'addict-ioc';

import {IDisposable, disposableDiscoveryTag, extensionDiscoveryTag} from '@essential-projects/bootstrapper_contracts';

export interface IExtension {
  name?: string;

  start(): Promise<void>;
  stop(): Promise<void>;
}

export class ExtensionBootstrapper {

  public readonly extensionDiscoveryTag: string;
  public readonly extensionInstances: Array<IExtension> = [];

  protected container: Container<IInstanceWrapper<any>>;

  constructor(container: Container<IInstanceWrapper<any>>, customExtensionDiscoveryTag: string) {

    this.container = container;
    this.extensionDiscoveryTag = customExtensionDiscoveryTag || extensionDiscoveryTag;

    if (typeof container === 'undefined') {
      throw new Error('IoC container is required.');
    }

    this.registerInstanceToIocContainer(this);
  }

  protected registerInstanceToIocContainer(instance: IExtension): void {

    const registrationKey = `${this.extensionDiscoveryTag}Bootstrapper`;

    if (!this.container.isRegistered(registrationKey)) {

      this.container.registerObject(registrationKey, instance);
    }
  }

  public async start(): Promise<void> {
    await this.startExtensions();
  }

  public async stop(): Promise<void> {
    await this.stopExtensions();
    await this.disposeByTags();
  }

  protected async startExtensions(): Promise<Array<void>> {
    const extensions = await this.discoverExtensions();

    return Promise.all(extensions.map((extension: IExtension): Promise<void> => {
      return this.startExtension(extension);
    }));
  }

  protected async startExtension(instance: IExtension): Promise<void> {
    await this.invokeAsPromiseIfPossible(instance.start, instance);
    this.extensionInstances.push(instance);
  }

  protected async stopExtensions(): Promise<void> {
    for (const extensionInstance of this.extensionInstances) {
      await this.stopExtension(extensionInstance);
    }
  }

  protected async stopExtension(instance: IExtension): Promise<void> {
    await this.invokeAsPromiseIfPossible(instance.stop, instance);
  }

  protected async disposeByTags(): Promise<void> {
    const discoveredDisposableKeys: Array<string> = this.container.getKeysByTags(disposableDiscoveryTag);

    for (const registrationKey of discoveredDisposableKeys) {
      const instance = await this.container.resolveAsync<IDisposable>(registrationKey);
      await this.invokeAsPromiseIfPossible(instance.dispose, instance);
    }
  }

  protected async discoverExtensions(): Promise<Array<IExtension>> {
    const discoveredExtensionKeys: Array<string> = this.container.getKeysByTags(this.extensionDiscoveryTag);

    const extensionInstances: Array<IExtension> = [];

    for (const registrationKey of discoveredExtensionKeys) {
      const instance = await this.container.resolveAsync<IExtension>(registrationKey);
      extensionInstances.push(instance);
    }

    return extensionInstances;
  }

  private async invokeAsPromiseIfPossible(functionToInvoke: any, invocationContext: any, invocationParameter?: Array<any>): Promise<any> {

    const isValidFunction = typeof functionToInvoke === 'function';
    if (!isValidFunction) {
      return Promise.resolve();
    }

    return await functionToInvoke.call(invocationContext, invocationParameter);
  }

}
