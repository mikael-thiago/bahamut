import { AssetCode, BalanceCalculatorService, Holding } from '../services/BalanceCalculatorService';

import { OperationRepository } from '../repositories/OperationRepository';
import { UseCase } from '../shared/UseCase';
import { UserKeyType } from '@entities/User';

//------------------------- DEFINITION -------------------------------------------//
export type ListInvestmentYearsRequest = {
  userId: UserKeyType;
};

export type ListInvestmentYearsResponse = {
  year: number;
  balance: number;
  balancePercentage: number;
  totals: { buys: number; sells: number };
}[];

export abstract class ListInvestmentYearsUseCase
  implements UseCase<ListInvestmentYearsRequest, ListInvestmentYearsResponse>
{
  abstract execute(request: ListInvestmentYearsRequest): Promise<ListInvestmentYearsResponse>;
}

//------------------------- END DEFINITION -------------------------------------------//

export class ListInvestmentYearsUseCaseImpl implements ListInvestmentYearsUseCase {
  constructor(
    private _operationRepository: OperationRepository,
    private _balanceCalculator: BalanceCalculatorService,
  ) {}

  async execute(request: ListInvestmentYearsRequest): Promise<ListInvestmentYearsResponse> {
    const { userId } = request;

    const operationsByYear = await this._operationRepository.getOperationsGroupedByYear({
      userId,
    });

    const balanceByYear: ListInvestmentYearsResponse = [];

    let holdings: Record<AssetCode, Holding> = {};

    for (const year in operationsByYear) {
      const yearOperations = operationsByYear[year];

      const {
        balance,
        balancePercentage,
        totals,
        holdings: lastHoldings,
      } = this._balanceCalculator.calculateBalance(yearOperations, holdings);

      balanceByYear.push({ year: +year, balance, balancePercentage, totals });
      holdings = lastHoldings;
    }

    return balanceByYear;
  }
}
