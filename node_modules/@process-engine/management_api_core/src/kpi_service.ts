import * as moment from 'moment';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels} from '@process-engine/management_api_contracts';
import {ILoggingApi, LogEntry, MetricMeasurementPoint} from '@process-engine/logging_api_contracts';
import {FlowNodeInstance, FlowNodeInstanceState, IFlowNodeInstanceRepository} from '@process-engine/persistence_api.contracts';

import {applyPagination} from './paginator';

/**
 * Groups LogEntries by their FlowNodeIds.
 *
 * Only use internally.
 */
type FlowNodeGroups = {
  [flowNodeId: string]: Array<LogEntry>;
};

/**
 * Groups LogEntries by their FlowNodeInstanceIds.
 *
 * Only use internally.
 */
type FlowNodeInstanceGroups = {
  [flowNodeInstanceId: string]: Array<LogEntry>;
};

/**
 * Contains the quartile runtime data for a FlowNode.
 *
 * Only use internally.
 */
type QuartileInfos = {
  firstQuartile: number;
  median: number;
  thirdQuartile: number;
};

export class KpiService implements APIs.IKpiManagementApi {

  private iamService: IIAMService;
  private flowNodeInstanceRepository: IFlowNodeInstanceRepository;
  private loggingService: ILoggingApi;

  constructor(
    flowNodeInstanceRepository: IFlowNodeInstanceRepository,
    iamService: IIAMService,
    loggingService: ILoggingApi,
  ) {
    this.flowNodeInstanceRepository = flowNodeInstanceRepository;
    this.iamService = iamService;
    this.loggingService = loggingService;
  }

  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformationList> {

    const logs = await this.loggingService.readLogForProcessModel(identity, processModelId);

    // Do not include FlowNode instances which are still being executed,
    // since they do net yet have a final runtime.
    const filteredLogs = logs.filter(this.logBelongsToFinishedFlowNodeInstance);

    if (!filteredLogs || filteredLogs.length === 0) {
      return {
        flowNodeRuntimeInformation: [],
        totalCount: 0,
      };
    }

    const logsGroupedByFlowNodeId = this.groupFlowNodeInstancesByFlowNodeId(filteredLogs);

    const groupKeys = Object.keys(logsGroupedByFlowNodeId);

    const runtimeInformations = groupKeys.map((flowNodeId: string): DataModels.Kpi.FlowNodeRuntimeInformation => {
      return this.createFlowNodeRuntimeInformation(processModelId, flowNodeId, logsGroupedByFlowNodeId[flowNodeId]);
    });

    const paginizedRuntimeInformations = applyPagination(runtimeInformations, offset, limit);

    return {flowNodeRuntimeInformation: paginizedRuntimeInformations, totalCount: runtimeInformations.length};
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    const logs = await this.loggingService.readLogForProcessModel(identity, processModelId);

    const flowNodeLogs = logs.filter((entry: LogEntry): boolean => {
      return entry.flowNodeId === flowNodeId;
    });

    if (!flowNodeLogs || flowNodeLogs.length === 0) {
      return undefined;
    }

    // Do not include FlowNode instances which are still being executed,
    // since they do net yet have a final runtime.
    const filteredLogs = flowNodeLogs.filter(this.logBelongsToFinishedFlowNodeInstance);

    const flowNodeRuntimeInformation = this.createFlowNodeRuntimeInformation(processModelId, flowNodeId, filteredLogs);

    return flowNodeRuntimeInformation;
  }

  public async getActiveTokensForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const flowNodeInstances = await this.flowNodeInstanceRepository.queryByProcessModel(processModelId);

    const activeFlowNodeInstances = flowNodeInstances.filter(this.isFlowNodeInstanceActive);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    const paginizedTokens = applyPagination(activeTokenInfos, offset, limit);

    return {activeTokens: paginizedTokens, totalCount: activeTokenInfos.length};
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const activeFlowNodeInstances = await this.flowNodeInstanceRepository.queryActiveByCorrelationAndProcessModel(correlationId, processModelId);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    const paginizedTokens = applyPagination(activeTokenInfos, offset, limit);

    return {activeTokens: paginizedTokens, totalCount: activeTokenInfos.length};
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const activeFlowNodeInstances = await this.flowNodeInstanceRepository.queryActiveByProcessInstance(processInstanceId);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    const paginizedTokens = applyPagination(activeTokenInfos, offset, limit);

    return {activeTokens: paginizedTokens, totalCount: activeTokenInfos.length};
  }

  public async getActiveTokensForFlowNode(
    identity: IIdentity,
    flowNodeId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Kpi.ActiveTokenList> {

    const flowNodeInstances = await this.flowNodeInstanceRepository.queryByFlowNodeId(flowNodeId);

    const activeFlowNodeInstances = flowNodeInstances.filter(this.isFlowNodeInstanceActive);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    const paginizedTokens = applyPagination(activeTokenInfos, offset, limit);

    return {activeTokens: paginizedTokens, totalCount: activeTokenInfos.length};
  }

  /**
   * Array-Filter that checks if a given log entry is suitable for including
   * it into the runtime calculations.
   *
   * First, it determines if the log was recorded when the FlowNodeInstance
   * was finished. If so, it is a valid log entry.
   *
   * If it is a log that was recorded at the beginnng of a FlowNodeInstance
   * execution, the function checks if a corresponding exiting log exists.
   *
   * If one is found, the log is suitable for including it with runtime
   * calculation.
   *
   * If no matching exiting log could be found, then this likely means the
   * FlowNodeInstance is still running. The log will not be included in the
   * calculations.
   *
   * @param   logToCheck      The log to validate.
   * @param   logIndex        The index the log has in the given Array.
   * @param   allFlowNodeLogs The full Array that is curently being filtered.
   * @returns                    True, if the log belongs to a finished
   *                             FlowNodeInstance, otherwise false.
   */
  private logBelongsToFinishedFlowNodeInstance(logToCheck: LogEntry, logIndex: number, allFlowNodeLogs: Array<LogEntry>): boolean {

    const logDoesNotBelongToAFlowNodeInstance = !logToCheck.flowNodeInstanceId || !logToCheck.flowNodeId;

    if (logDoesNotBelongToAFlowNodeInstance) {
      return false;
    }

    const logWasRecordedOnFlowNodeExit = logToCheck.measuredAt === MetricMeasurementPoint.onFlowNodeExit;
    if (logWasRecordedOnFlowNodeExit) {
      return true;
    }

    const hasMatchingExitLog = allFlowNodeLogs.some((entry: LogEntry): boolean => {

      const belongsToSameFlowNodeInstance = logToCheck.flowNodeInstanceId === entry.flowNodeInstanceId;

      const hasMatchingState =
        !(entry.measuredAt === MetricMeasurementPoint.onFlowNodeEnter || entry.measuredAt === MetricMeasurementPoint.onFlowNodeSuspend);

      return belongsToSameFlowNodeInstance && hasMatchingState;
    });

    return hasMatchingExitLog;
  }

  private groupFlowNodeInstancesByFlowNodeId(logs: Array<LogEntry>): FlowNodeGroups {

    const groupedLogs: FlowNodeGroups = {};

    for (const log of logs) {

      const groupHasNoMatchingEntry = !groupedLogs[log.flowNodeId];

      if (groupHasNoMatchingEntry) {
        groupedLogs[log.flowNodeId] = [];
      }

      groupedLogs[log.flowNodeId].push(log);
    }

    return groupedLogs;
  }

  private createFlowNodeRuntimeInformation(
    processModelId: string,
    flowNodeId: string,
    logs: Array<LogEntry>,
  ): DataModels.Kpi.FlowNodeRuntimeInformation {

    const groupedLogs = this.groupLogsByFlowNodeInstance(logs);

    const flowNodeInstanceId = Object.keys(groupedLogs);

    const runtimes = flowNodeInstanceId.map((flowNodeInstanceKey: string): number => {
      return this.calculateRuntimeForFlowNodeInstance(groupedLogs[flowNodeInstanceKey]);
    });

    const quartileInfos = this.calculateQuartiles(runtimes);

    const runtimeInformation = new DataModels.Kpi.FlowNodeRuntimeInformation();
    runtimeInformation.flowNodeId = flowNodeId;
    runtimeInformation.processModelId = processModelId;
    runtimeInformation.minRuntimeInMs = Math.min(...runtimes);
    runtimeInformation.maxRuntimeInMs = Math.max(...runtimes);
    runtimeInformation.arithmeticMeanRuntimeInMs = this.calculateFlowNodeArithmeticMeanRuntime(runtimes);
    runtimeInformation.firstQuartileRuntimeInMs = quartileInfos.firstQuartile;
    runtimeInformation.medianRuntimeInMs = quartileInfos.median;
    runtimeInformation.thirdQuartileRuntimeInMs = quartileInfos.thirdQuartile;

    return runtimeInformation;
  }

  private groupLogsByFlowNodeInstance(logs: Array<LogEntry>): FlowNodeInstanceGroups {

    const groupedLogs = {};

    for (const log of logs) {

      const groupHasNoMatchingEntry = !groupedLogs[log.flowNodeInstanceId];

      if (groupHasNoMatchingEntry) {
        groupedLogs[log.flowNodeInstanceId] = [];
      }

      groupedLogs[log.flowNodeInstanceId].push(log);
    }

    return groupedLogs;
  }

  private calculateRuntimeForFlowNodeInstance(logs: Array<LogEntry>): number {

    const onEnterLog = logs.find((log: LogEntry): boolean => {
      return log.measuredAt === MetricMeasurementPoint.onFlowNodeEnter;
    });

    const onExitLog = logs.find((log: LogEntry): boolean => {
      return log.measuredAt === MetricMeasurementPoint.onFlowNodeExit ||
             log.measuredAt === MetricMeasurementPoint.onFlowNodeError;
    });

    const startTime = moment(onEnterLog.timeStamp);
    const endTime = moment(onExitLog.timeStamp);

    const runtimeDiff = endTime.diff(startTime);
    const runtimeTotal = moment
      .duration(runtimeDiff)
      .asMilliseconds();

    return runtimeTotal;
  }

  private calculateQuartiles(runtimes: Array<number>): QuartileInfos {

    const runtimeAmounts = runtimes.length;

    const sortedRuntimes = runtimes.sort((prevValue: number, currentValue: number): number => {
      return prevValue - currentValue;
    });

    let quartileAmounts: number;
    let medianAmounts: number;

    let firstQuartileData: Array<number>;
    let medianQuartileData: Array<number>;
    let thirdQuartileData: Array<number>;

    // tslint:disable:no-magic-numbers
    if (runtimeAmounts >= 3) {
      // We have enough data to reasonably extrapolate the quartiles.
      quartileAmounts = Math.floor(runtimes.length / 4);
      medianAmounts = Math.ceil(runtimes.length / 2);

      firstQuartileData = sortedRuntimes.slice(0, quartileAmounts);
      medianQuartileData = sortedRuntimes.slice(quartileAmounts, quartileAmounts + medianAmounts);
      thirdQuartileData = sortedRuntimes.slice(sortedRuntimes.length - quartileAmounts);
    } else {
      // There is not enough data to reasonably extrapolate quartiles.
      // Use all available data for each quartile instead.
      quartileAmounts = runtimeAmounts;
      medianAmounts = runtimeAmounts;

      firstQuartileData = sortedRuntimes;
      medianQuartileData = sortedRuntimes;
      thirdQuartileData = sortedRuntimes;
    }

    const firstQuartileRuntime = this.calculateFlowNodeArithmeticMeanRuntime(firstQuartileData);
    const medianQuartileRuntime = this.calculateFlowNodeArithmeticMeanRuntime(medianQuartileData);
    const thirdQuartileRuntime = this.calculateFlowNodeArithmeticMeanRuntime(thirdQuartileData);

    return {
      firstQuartile: firstQuartileRuntime,
      median: medianQuartileRuntime,
      thirdQuartile: thirdQuartileRuntime,
    };
  }

  private calculateFlowNodeArithmeticMeanRuntime(runtimes: Array<number>): number {

    const allRuntimes = runtimes.reduce((previousValue: number, currentValue: number): number => {
      return previousValue + currentValue;
    }, 0);

    const meanRuntime = Math.round(allRuntimes / runtimes.length);

    return meanRuntime;
  }

  private isFlowNodeInstanceActive(flowNodeInstance: FlowNodeInstance): boolean {
    return flowNodeInstance.state === FlowNodeInstanceState.running
      || flowNodeInstance.state === FlowNodeInstanceState.suspended;
  }

  private createActiveTokenInfoForFlowNodeInstance(flowNodeInstance: FlowNodeInstance): DataModels.Kpi.ActiveToken {

    const currentProcessToken = flowNodeInstance.tokens[0];

    const activeTokenInfo = new DataModels.Kpi.ActiveToken();
    activeTokenInfo.processInstanceId = currentProcessToken.processInstanceId;
    activeTokenInfo.processModelId = currentProcessToken.processModelId;
    activeTokenInfo.correlationId = currentProcessToken.correlationId;
    activeTokenInfo.flowNodeId = flowNodeInstance.flowNodeId;
    activeTokenInfo.flowNodeInstanceId = flowNodeInstance.id;
    activeTokenInfo.identity = currentProcessToken.identity;
    activeTokenInfo.createdAt = currentProcessToken.createdAt;
    activeTokenInfo.payload = currentProcessToken.payload;

    return activeTokenInfo;
  }

}
