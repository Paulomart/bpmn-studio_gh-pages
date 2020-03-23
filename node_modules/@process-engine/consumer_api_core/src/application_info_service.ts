import * as appRootPath from 'app-root-path';
import * as fs from 'fs';
import * as path from 'path';

import {APIs, DataModels} from '@process-engine/consumer_api_contracts';

export class ApplicationInfoService implements APIs.IApplicationInfoConsumerApi {

  private applicationInfo: DataModels.ApplicationInfo;

  public async getApplicationInfo(): Promise<DataModels.ApplicationInfo> {
    if (!this.applicationInfo) {
      this.readApplicationPackageJson();
    }

    return this.applicationInfo;
  }

  private readApplicationPackageJson(): void {
    const isEmbeddedIntoRuntime = __dirname.indexOf('process_engine_runtime') > 0;

    const pathToPackageJson = isEmbeddedIntoRuntime
      ? this.getPackageJsonLocationForProcessEngineRuntime()
      : this.getPackageJsonLocationForHostApplication();

    const packageJson = this.getPackageJsonContent(pathToPackageJson);

    this.applicationInfo = {
      name: packageJson.name,
      version: packageJson.version,
    };
  }

  private getPackageJsonLocationForProcessEngineRuntime(): string {
    // Note that if the Runtime is embedded into another application, the runtime's package.json will not be the main package.json,
    // It will instead be located in `someapplication/node_modules/@process-engine/process_engine-runtime`.
    // Therefore, we cannot use app-root-path here.
    const applicationFolderIndex = __dirname.lastIndexOf('process_engine_runtime');
    const pathToRuntime = __dirname.substring(0, applicationFolderIndex);
    const pathToPackageJson = path.resolve(pathToRuntime, 'process_engine_runtime', 'package.json');

    return pathToPackageJson;
  }

  private getPackageJsonLocationForHostApplication(): string {
    // When running this from inside other applications than the runtime (like consumer_api_meta),
    // we'll get the package info for the host application.
    const rootPath = appRootPath.toString();
    const pathToPackageJson = path.resolve(rootPath, 'package.json');

    return pathToPackageJson;
  }

  private getPackageJsonContent(pathToPackageJson: string): any {
    const packageJsonAsString = fs.readFileSync(pathToPackageJson, 'utf-8');
    const packageJson = JSON.parse(packageJsonAsString);

    return packageJson;
  }

}
