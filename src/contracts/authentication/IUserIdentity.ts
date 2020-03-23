export interface IUserIdentity {
  id: string;
  name: string;
  given_name?: string;
  family_name?: string;
  roles: Array<string>;
}
