import {TokenHistoryEntryList} from './token_history_entry_list';

/**
 * Describes a group of ProcessTokens for a specific ProcessInstance.
 */
export type TokenHistoryGroup = {[processInstanceId: string]: TokenHistoryEntryList};
