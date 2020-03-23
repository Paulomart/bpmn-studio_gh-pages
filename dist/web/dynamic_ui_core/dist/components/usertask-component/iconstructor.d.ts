export interface IConstructor<T> {
    new (...args: Array<any>): T;
}
