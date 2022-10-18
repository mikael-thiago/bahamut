export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export interface PagedResult<T> {
  items: T[];
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  total: number;
  totalPages: number;
}

export interface SortParams<T> {
  sortColumn?: T;
  sortDirection?: SortDirection;
}

export interface PageParams {
  page: number;
  pageSize: number;
}
