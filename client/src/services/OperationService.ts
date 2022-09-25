import { HttpAdapter, httpAdapter } from "../adapters/http/api";

export interface InvestmentYear {
  year: number;
  balance: number;
  balancePercentage: number;
  totals: { buys: number; sells: number };
}

export abstract class OperationService {
  abstract getInvestmentYears(): Promise<InvestmentYear[]>;
}

export class OperationServiceImpl implements OperationService {
  constructor(private _api: HttpAdapter) {}

  getInvestmentYears(): Promise<InvestmentYear[]> {
    return this._api.get("operations/groupedByYear");
  }
}

const operationService: OperationService = new OperationServiceImpl(httpAdapter);

export const useOperationService = (): OperationService => ({
  getInvestmentYears: operationService.getInvestmentYears.bind(operationService),
});
