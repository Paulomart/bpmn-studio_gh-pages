/**
 * Contains a response from the ProcessEngine, which will be send after a ProcessModel was started.
 * Depending on the type of start callback used, this will also contain information about the Correlation result.
 */
export class ProcessStartResponsePayload {

  /**
   * The ID of the ProcessInstance.
   */
  public processInstanceId?: string;
  /**
   * The ID of the Correlation in which the started ProcessModel runs.
   */
  public correlationId: string;
  /**
   * Optional: If the ProcessEngine is set to wait for the ProcessInstance to finish,
   * this will contain the ID of the EndEvent with which ProcessInstance was finished.
   */
  public endEventId?: string;
  /**
   * Optional: If the ProcessEngine is set to wait for the ProcessInstance to finish,
   * this will contain the final result with which ProcessInstance was finished.
   */
  public tokenPayload?: string;

}
