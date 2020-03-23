import {IIdentity} from '@essential-projects/iam_contracts';

/**
 * Provides functions for managing Socket.IO clients.
 */
export interface IConsumerSocketIoAccessor {

  /**
   * Uses the given identity to connect this client to the Socket.IO server.
   *
   * @param identity The identity with which to create the connection.
   */
  initializeSocket(identity: IIdentity): void;

  /**
   * Uses the given identity to disconnect this client from the Socket.IO server.
   *
   * @param identity The identity with which to create the connection.
   */
  disconnectSocket(identity: IIdentity): void;
}
