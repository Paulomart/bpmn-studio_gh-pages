import {Event} from '../event/index';

/**
 * Describes a ProcessModel.
 * The content is always user specific and will not contain any information
 * that a requesting user is not allowed to see.
 */
export class ProcessModel {

  public id: string;
  public startEvents: Array<Event> = [];
  public endEvents: Array<Event> = [];

}
