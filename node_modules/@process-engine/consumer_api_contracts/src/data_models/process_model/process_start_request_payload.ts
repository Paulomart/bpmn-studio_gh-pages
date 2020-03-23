/**
 * Describes the payload that a ProcessModel can be started with.
 */
export class ProcessStartRequestPayload {

  /**
   * Optional: If set, the ProcessEngine will use this as the ID for the
   * Correlation in which the ProcessModel will be executed.
   * If not provided, the ProcessEngine will generate a CorrelationId automatically.
   */
  public correlationId?: string;
  /**
    * Optional: If a Subprocess is to be started, this will contain the ID of
    * the ProcessInstance that started it.
    */
  public callerId?: string;
  /**
   * Contains the arguments with which to start the ProcessInstance.
   */
  public inputValues: any;

}
