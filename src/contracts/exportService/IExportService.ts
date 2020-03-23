export interface IExportService {
  export(filename: string): Promise<void>;
}
