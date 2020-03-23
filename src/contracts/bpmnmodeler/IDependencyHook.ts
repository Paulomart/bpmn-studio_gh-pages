export interface IDependencyHook {
  __depends__: Array<string>;
  __init__: Array<string>;
  [index: string]: [string, any] | Array<string>;
}
