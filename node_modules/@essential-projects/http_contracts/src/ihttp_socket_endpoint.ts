export interface IHttpSocketEndpoint {
  readonly namespace: string;
  initializeEndpoint(socketIo: SocketIO.Namespace): Promise<any> | any;
  dispose(): Promise<void> | void;
}
