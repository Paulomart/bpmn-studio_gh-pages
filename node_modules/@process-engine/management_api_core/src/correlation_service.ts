import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels} from '@process-engine/management_api_contracts';
import {Correlation, ICorrelationService, ProcessInstance} from '@process-engine/persistence_api.contracts';

import {applyPagination} from './paginator';

export class CorrelationService implements APIs.ICorrelationManagementApi {

  private readonly correlationService: ICorrelationService;

  constructor(correlationService: ICorrelationService) {
    this.correlationService = correlationService;
  }

  public async getAllCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {

    const correlations = await this.correlationService.getAll(identity);

    const managementApiCorrelations = correlations.map<DataModels.Correlations.Correlation>(this.mapToPublicCorrelation.bind(this));

    const paginizedCorrelations = applyPagination(managementApiCorrelations, offset, limit);

    return {correlations: paginizedCorrelations, totalCount: managementApiCorrelations.length};
  }

  public async getActiveCorrelations(
    identity: IIdentity,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {

    const activeCorrelations = await this.correlationService.getActive(identity);

    const managementApiCorrelations = activeCorrelations.map<DataModels.Correlations.Correlation>(this.mapToPublicCorrelation.bind(this));

    const paginizedCorrelations = applyPagination(managementApiCorrelations, offset, limit);

    return {correlations: paginizedCorrelations, totalCount: managementApiCorrelations.length};
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {

    const correlationFromProcessEngine = await this.correlationService.getByCorrelationId(identity, correlationId);

    const managementApiCorrelation = this.mapToPublicCorrelation(correlationFromProcessEngine);

    return managementApiCorrelation;
  }

  public async getCorrelationsByProcessModelId(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Correlations.CorrelationList> {

    const correlations = await this.correlationService.getByProcessModelId(identity, processModelId);

    const managementApiCorrelations = correlations.map<DataModels.Correlations.Correlation>(this.mapToPublicCorrelation.bind(this));

    const paginizedCorrelations = applyPagination(managementApiCorrelations, offset, limit);

    return {correlations: paginizedCorrelations, totalCount: managementApiCorrelations.length};
  }

  public async getProcessInstanceById(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.ProcessInstance> {

    const processInstance = await this.correlationService.getByProcessInstanceId(identity, processInstanceId);

    const managementApiProcessInstance = this.mapToPublicProcessInstance(processInstance);

    return managementApiProcessInstance;
  }

  public async getProcessInstancesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {

    const processInstances = await this.correlationService.getProcessInstancesForCorrelation(identity, correlationId);

    const managementApiProcessInstances = processInstances.map(this.mapToPublicProcessInstance);

    const paginizedProcessInstances = applyPagination(managementApiProcessInstances, offset, limit);

    return {processInstances: paginizedProcessInstances, totalCount: managementApiProcessInstances.length};
  }

  public async getProcessInstancesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {

    const processInstances = await this.correlationService.getProcessInstancesForProcessModel(identity, processModelId);

    const managementApiProcessInstances = processInstances.map(this.mapToPublicProcessInstance);

    const paginizedProcessInstances = applyPagination(managementApiProcessInstances, offset, limit);

    return {processInstances: paginizedProcessInstances, totalCount: managementApiProcessInstances.length};
  }

  public async getProcessInstancesByState(
    identity: IIdentity,
    state: DataModels.Correlations.CorrelationState,
    offset?: number,
    limit?: number,
  ): Promise<DataModels.Correlations.ProcessInstanceList> {

    const processInstances = await this.correlationService.getProcessInstancesByState(identity, state);

    const managementApiProcessInstances = processInstances.map(this.mapToPublicProcessInstance);

    const paginizedProcessInstances = applyPagination(managementApiProcessInstances, offset, limit);

    return {processInstances: paginizedProcessInstances, totalCount: managementApiProcessInstances.length};
  }

  private mapToPublicCorrelation(runtimeCorrelation: Correlation): DataModels.Correlations.Correlation {

    const managementApiCorrelation = new DataModels.Correlations.Correlation();
    managementApiCorrelation.id = runtimeCorrelation.id;
    managementApiCorrelation.state = DataModels.Correlations.CorrelationState[runtimeCorrelation.state];
    managementApiCorrelation.error = runtimeCorrelation.error;
    managementApiCorrelation.createdAt = runtimeCorrelation.createdAt;

    managementApiCorrelation.processInstances = runtimeCorrelation
      .processInstances
      .map(this.mapToPublicProcessInstance);

    return managementApiCorrelation;
  }

  private mapToPublicProcessInstance(runtimeProcessInstance: ProcessInstance): DataModels.Correlations.ProcessInstance {

    const managementApiProcessInstance = new DataModels.Correlations.ProcessInstance();

    managementApiProcessInstance.correlationId = runtimeProcessInstance.correlationId;
    managementApiProcessInstance.processDefinitionName = runtimeProcessInstance.processDefinitionName;
    managementApiProcessInstance.hash = runtimeProcessInstance.hash;
    managementApiProcessInstance.xml = runtimeProcessInstance.xml;
    managementApiProcessInstance.processModelId = runtimeProcessInstance.processModelId;
    managementApiProcessInstance.processInstanceId = runtimeProcessInstance.processInstanceId;
    managementApiProcessInstance.parentProcessInstanceId = runtimeProcessInstance.parentProcessInstanceId;
    managementApiProcessInstance.state = DataModels.Correlations.CorrelationState[runtimeProcessInstance.state];
    managementApiProcessInstance.error = runtimeProcessInstance.error;
    managementApiProcessInstance.identity = runtimeProcessInstance.identity;
    managementApiProcessInstance.createdAt = runtimeProcessInstance.createdAt;
    managementApiProcessInstance.terminatedBy = runtimeProcessInstance.terminatedBy;
    managementApiProcessInstance.finishedAt = runtimeProcessInstance.finishedAt;

    return managementApiProcessInstance;
  }

}
