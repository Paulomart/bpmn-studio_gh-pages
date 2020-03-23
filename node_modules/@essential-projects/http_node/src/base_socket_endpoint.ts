import {IHttpSocketEndpoint, defaultSocketNamespace} from '@essential-projects/http_contracts';

export abstract class BaseSocketEndpoint implements IHttpSocketEndpoint {

  public get namespace(): string {
    return defaultSocketNamespace;
  }

  public abstract initializeEndpoint(socketIo: SocketIO.Namespace): Promise<any> | any;

  /**
   * If any resources need to be disposed when the serves closes down, this
   * method can be implemented in the inheriting class.
   */
  public dispose(): Promise<void> | void { }

}
