export class FlowNodeRuntimeInformation {

  public processModelId: string;
  public flowNodeId: string;
  public arithmeticMeanRuntimeInMs: number;
  public firstQuartileRuntimeInMs: number;
  public medianRuntimeInMs: number; // aka second quartile
  public thirdQuartileRuntimeInMs: number;
  public minRuntimeInMs: number;
  public maxRuntimeInMs: number;

}
