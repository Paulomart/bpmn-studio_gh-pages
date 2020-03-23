import {IIdentity} from '@essential-projects/iam_contracts';

import {ApplicationInfo} from '../data_models/application_info';

/**
 * The IApplicationInfoConsumerApi is used to retrieve basic information about the running application.
 */
export interface IApplicationInfoConsumerApi {

  /**
   * Gets the package name and version of the running application.
   *
   * @async
   * @returns Some Basic information about the running application.
   */
  getApplicationInfo(identity: IIdentity): Promise<ApplicationInfo>;
}
