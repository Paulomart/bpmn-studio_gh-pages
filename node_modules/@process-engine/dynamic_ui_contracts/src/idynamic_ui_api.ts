export interface IDynamicUIApi {
  readonly assetsPath: string;

  getIndex(formKey: string): Promise<any>;

  getWebcomponent(formKey: string): Promise<any>;
}
