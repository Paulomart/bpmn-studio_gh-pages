/**
 * Contains information about the result with which a Correlation has finished execution.
 */
export class CorrelationResult {

  /**
   * The id of the Correlation that was finished.
   */
  public correlationId: string;
  /**
   * The id of the EndEvent with which the Correlation was finished.
   */
  public endEventId: string;
  /**
   * Contains the final result with which a Correlation was finished.
   */
  public tokenPayload: string;

}
