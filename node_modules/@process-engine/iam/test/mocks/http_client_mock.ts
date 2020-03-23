/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpClientMock {

  public claimConfig: any = {
    userId1: {
      claim1: true,
      claim2: false,
      claim3: true,
      claim4: false,
    },
    userId2: {
      claim1: false,
      claim2: true,
      claim3: false,
      claim4: true,
    },
  };

  private okResponse = {
    status: 204,
  };

  private notOkResponse = {
    status: 403,
  };

  public get(url: string, authHeaders: any): any {

    const urlParts = url.split('/');
    const claimName = urlParts[urlParts.length - 1];

    const userToken = authHeaders.headers.Authorization as string;

    // Remove the "Bearer " prefix
    const userName = userToken.substring(7);

    if (!this.claimConfig[userName]) {
      return this.notOkResponse;
    }

    if (!this.claimConfig[userName][claimName]) {
      return this.notOkResponse;
    }

    return this.okResponse;
  }

}
