export interface IHttpRouter {
  readonly router: any;
  readonly baseRoute: string;
  initialize(): Promise<any> | any;
  initializeRouter(): Promise<any> | any;
  dispose(): Promise<void> | void;
}
