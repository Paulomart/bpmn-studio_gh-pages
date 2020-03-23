export interface IIAMConfiguration {
  clientId: string;
  clientSecret: string;
  introspectPath: string;
  claimPath?: string;
  disableClaimCheck?: boolean;
  allowGodToken?: boolean;
  cache?: IClaimCacheConfiguration;
}

export interface IClaimCacheConfiguration {
  enabled: boolean;
  cacheLifetimeInSeconds: number;
  cleanupIntervalInSeconds: number;
}
