import { HttpAdapter, httpAdapter } from "../adapters/http/api";

export enum OperationSortColumn {
  Date = "date",
  AssetCode = "assetCode",
  Quantity = "quantity",
  Type = "type",
}

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

export interface InvestmentDetailsDTO {
  balance: number;
  balancePercentage: number;
  totals: { buys: number; sells: number };
}

export type InvestmentYear = InvestmentDetailsDTO & {
  year: number;
};

export type OperationKeyType = string;

export enum OperationType {
  Buying = 1,
  Selling = 2,
}

export interface Operation {
  id: string;
  assetCode: string;
  quantity: number;
  valuePerAsset: number;
  date: Date;
  type: OperationType;
  userId: string;
}

export interface CreateOperationRequest {
  assetCode: string;
  quantity: number;
  valuePerAsset: number;
  date: Date;
  type: OperationType;
}

export interface GetOperationsPagedRequest {
  year: number;
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
}

export interface InvestmentYearDetailsDTO {
  balance: number;
  balancePercentage: number;
  months: (InvestmentDetailsDTO & { month: number })[];
}

export abstract class OperationService {
  abstract getInvestmentYears(): Promise<InvestmentYear[]>;
  abstract createOperation(request: CreateOperationRequest): Promise<any>;
  abstract getInvestmentYearDetails(request: { year: number }): Promise<InvestmentYearDetailsDTO>;
  abstract getYearOperationsPaged(
    request: GetOperationsPagedRequest
  ): Promise<PagedResult<Operation>>;
}

export class OperationServiceImpl implements OperationService {
  constructor(private _api: HttpAdapter) {}

  getYearOperationsPaged = async ({
    year,
    page,
    pageSize,
    sortColumn = "date",
    sortDirection = "desc",
  }: GetOperationsPagedRequest): Promise<PagedResult<Operation>> => {
    return this._api
      .get<PagedResult<Omit<Operation, "date"> & { date: string }>>(`operations/${year}`, {
        query: { page, pageSize, sortColumn, sortDirection },
      })
      .then(({ items, ...rest }) => ({
        ...rest,
        items: items.map(item => ({ ...item, date: new Date(item.date) })),
      }));
  };

  getInvestmentYearDetails = ({ year }: { year: number }): Promise<InvestmentYearDetailsDTO> => {
    return this._api.get(`operations/${year}/details`);
  };

  createOperation = (request: CreateOperationRequest): Promise<any> => {
    return this._api.post("operations", { ...request, date: new Date(request.date).toISOString() });
  };

  getInvestmentYears = (): Promise<InvestmentYear[]> => {
    return this._api.get("operations/groupedByYear");
  };
}

const operationService: OperationService = new OperationServiceImpl(httpAdapter);

export const useOperationService = (): OperationService => operationService;
