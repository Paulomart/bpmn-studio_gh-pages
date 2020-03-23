import {IIdentity} from './iidentity';

export interface IIAMService {
  ensureHasClaim(identity: IIdentity, claimName: string): Promise<void>;
}
