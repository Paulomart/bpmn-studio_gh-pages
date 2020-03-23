/* eslint-disable @typescript-eslint/no-explicit-any */

export class ClaimCheckCacheMock {

  public config: any;

  public cache: any = {
    userId1: {
      claim1: {
        userHasClaim: false,
      },
      claim2: {
        userHasClaim: true,
      },
    },
    userId2: {
      claim1: {
        userHasClaim: true,
      },
      claim3: {
        userHasClaim: true,
      },
    },
  };

  constructor(config?: any) {
    this.config = config;
  }

  public get enabled(): boolean {
    return this.config.enabled;
  }

  public add(userId: string, claimName: string, hasClaim: boolean): void {

    if (!this.config.enabled) {
      return;
    }

    const userIdNotYetCached = !this.cache[userId];
    if (userIdNotYetCached) {
      this.cache[userId] = {};
    }

    const claimNotCached = !this.hasMatchingEntry(userId, claimName);

    if (claimNotCached) {
      this.cache[userId][claimName] = {
        userHasClaim: hasClaim,
      };
    } else {
      this.cache[userId][claimName].userHasClaim = hasClaim;
    }
  }

  public get(userId: string, claimName: string): any {
    if (!this.hasMatchingEntry(userId, claimName)) {
      return undefined;
    }

    return this.cache[userId][claimName];
  }

  public hasMatchingEntry(userId: string, claimName: string): boolean {
    return this.cache[userId] !== undefined &&
           this.cache[userId][claimName] !== undefined;
  }

}
