export interface PagedResult<T> {
  items: T[];
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  total: number;
  totalPages: number;
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}
