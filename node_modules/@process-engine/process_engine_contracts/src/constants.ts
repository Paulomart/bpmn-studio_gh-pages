/**
 * Contains a list of all known BPMN types and maps them to their corresponding XML tag.
 */
export enum BpmnType {
  emptyActivity = 'bpmn:Task',
  userTask = 'bpmn:UserTask',
  exclusiveGateway = 'bpmn:ExclusiveGateway',
  parallelGateway = 'bpmn:ParallelGateway',
  serviceTask = 'bpmn:ServiceTask',
  startEvent = 'bpmn:StartEvent',
  endEvent = 'bpmn:EndEvent',
  intermediateCatchEvent = 'bpmn:IntermediateCatchEvent',
  intermediateThrowEvent = 'bpmn:IntermediateThrowEvent',
  scriptTask = 'bpmn:ScriptTask',
  boundaryEvent = 'bpmn:BoundaryEvent',
  callActivity = 'bpmn:CallActivity',
  subProcess = 'bpmn:SubProcess',
  manualTask = 'bpmn:ManualTask',
  complexGateway = 'bpmn:ComplexGateway',
  inclusiveGateway = 'bpmn:InclusiveGateway',
  eventBasedGateway = 'bpmn:EventBasedGateway',
  sendTask = 'bpmn:SendTask',
  receiveTask = 'bpmn:ReceiveTask',
}

/**
 * Contains a list of all supported event types.
 */
export enum EventType {
  linkEvent = 'linkEvent',
  messageEvent = 'messageEvent',
  signalEvent = 'signalEvent',
  terminateEvent = 'terminateEvent',
  timerEvent = 'timerEvent',
  errorEvent = 'errorEvent',
}
