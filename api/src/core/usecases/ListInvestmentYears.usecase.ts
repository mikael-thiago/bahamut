import { AssetCode, BalanceCalculatorService, Holding } from '../services/BalanceCalculatorService';

import { OperationRepository } from '../repositories/OperationRepository';
import { UseCase } from '../shared/UseCase';
import { UserKeyType } from '@entities/User';
import { InvestmentDetailsDTO } from '../dtos/InvestmentDetailsDTO';

//------------------------- DEFINITION -------------------------------------------//
export type ListInvestmentYearsRequest = {
  userId: UserKeyType;
};

export type ListInvestmentYearsResponse = (InvestmentDetailsDTO & { year: number })[];

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

    const sortedYears = Object.keys(operationsByYear)
      .map((year) => +year)
      .sort((a, b) => a - b);

    const balanceByYear: ListInvestmentYearsResponse = [];

    let holdings: Record<AssetCode, Holding> = {};

    for (const year of sortedYears) {
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
