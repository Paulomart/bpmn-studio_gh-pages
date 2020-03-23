import {IIdentity} from './iidentity';

export interface IIdentityService {
  getIdentity(token: string): Promise<IIdentity>;
}
