import {IIdentity} from '@essential-projects/iam_contracts';

export class Identity implements IIdentity {

  public readonly token: string;
  public readonly userId: string;

  constructor(token: string, userId: string) {
    this.token = token;
    this.userId = userId;
  }

}
