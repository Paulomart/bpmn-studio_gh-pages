/**
 * The base class for definining event messages.
 */
export class BaseEventMessage {

  public readonly correlationId: string;
  public readonly processModelId: string;
  public readonly processInstanceId: string;
  public readonly flowNodeId: string;
  public readonly flowNodeInstanceId: string;
  public readonly currentToken: any;

  constructor(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    currentToken: any,
  ) {
    this.correlationId = correlationId;
    this.processModelId = processModelId;
    this.processInstanceId = processInstanceId;
    this.flowNodeId = flowNodeId;
    this.flowNodeInstanceId = flowNodeInstanceId;
    this.currentToken = currentToken;
  }

}
