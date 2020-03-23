/**
 * Contains the definition of metric measurement points.
 *
 * These points state the time of the ProcessModels lifecycle at which the
 * metric was measured.
 */
export enum MetricMeasurementPoint {
  onProcessStart = 'onProcessStart',
  onProcessFinish = 'onProcessFinish',
  onProcessError = 'onProcessError',
  onFlowNodeEnter = 'onFlowNodeEnter',
  onFlowNodeExit = 'onFlowNodeExit',
  onFlowNodeError = 'onFlowNodeError',
  onFlowNodeSuspend = 'onFlowNodeSuspend',
  onFlowNodeResume = 'onFlowNodeResume',
}
