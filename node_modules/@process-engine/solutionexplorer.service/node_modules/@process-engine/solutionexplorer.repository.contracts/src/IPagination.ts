export interface IPagination<TEntry> {
  count: number;
  offset: number;
  limit: number;
  data: Array<TEntry>;
}
