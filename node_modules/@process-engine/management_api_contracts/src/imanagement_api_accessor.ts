/* eslint-disable @typescript-eslint/no-empty-interface */
import {IManagementApiClient} from './imanagement_api_client';

/**
 * This interface wraps the Accessor that the ManagementApiClient will
 * use to connect to an internal or external ProcessEngine.
 * It is derived from IManagementApiClient, because the Accessor will have to
 * perform the same type of requests as the Client, regardless of which type
 * of ProcessEngine is used.
 */
export interface IManagementApiAccessor extends IManagementApiClient {}
