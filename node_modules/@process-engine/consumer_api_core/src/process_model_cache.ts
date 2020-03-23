import {Model} from '@process-engine/persistence_api.contracts';

/**
 * Used to cache ProcessModels during conversion of suspended FlowNodeInstances.
 * This helps to avoid repeated queries against the database for the same ProcessModel.
 */
type ProcessModelCache = {[cacheEntryKey: string]: Model.Process};

const processModelCache: ProcessModelCache = {};

export function hasEntry(cacheEntryKey: string): boolean {
  return processModelCache[cacheEntryKey] !== undefined;
}

export function add(cacheEntryKey: string, processModel: Model.Process): void {
  processModelCache[cacheEntryKey] = processModel;
}

export function get(cacheEntryKey: string): Model.Process {
  return processModelCache[cacheEntryKey];
}
