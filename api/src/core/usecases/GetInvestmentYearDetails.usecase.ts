import { Operation } from '@entities/Operation';
import { UserKeyType } from '@entities/User';
import { OperationRepository } from '@repositories/OperationRepository';
import { InvestmentDetailsDTO } from '../dtos/InvestmentDetailsDTO';
import { BalanceCalculatorService } from '../services/BalanceCalculatorService';
import { UseCase } from '../shared/UseCase';

export interface GetInvestmentYearDetailsUseCaseRequest {
  year: number;
  userId: UserKeyType;
}

export type GetInvestmentYearDetailsUseCaseResponse = {
  balance: number;
  balancePercentage: number;
  months: (InvestmentDetailsDTO & { month: number })[];
};

export abstract class GetInvestmentYearDetailsUseCase
  implements UseCase<GetInvestmentYearDetailsUseCaseRequest, GetInvestmentYearDetailsUseCaseResponse>
{
  abstract execute(request: GetInvestmentYearDetailsUseCaseRequest): Promise<GetInvestmentYearDetailsUseCaseResponse>;
}

export class GetInvestmentYearDetailsUseCaseImpl implements GetInvestmentYearDetailsUseCase {
  constructor(
    private _operationRepository: OperationRepository,
    private _balanceCalculator: BalanceCalculatorService,
  ) {}

  async execute({
    userId,
    year,
  }: GetInvestmentYearDetailsUseCaseRequest): Promise<GetInvestmentYearDetailsUseCaseResponse> {
    const operationsByYear = await this._operationRepository.getOperationsGroupedByYear({ userId });

    let holdings = {};
    let yearBalance = 0;
    let yearBalancePercentage = 0;

    const sortedYears = Object.keys(operationsByYear)
      .map((year) => +year)
      .sort((a, b) => a - b);

    for (const yearIterator of sortedYears) {
      if (yearIterator > year) break;

      const {
        balance,
        balancePercentage,
        holdings: lastHoldings,
      } = this._balanceCalculator.calculateBalance(operationsByYear[yearIterator], holdings);

      if (yearIterator < year) holdings = lastHoldings;

      if (yearIterator === year) {
        yearBalance = balance;
        yearBalancePercentage = balancePercentage;
      }
    }

    const operationsByMonth = this._groupByMonth(operationsByYear[year]);

    const response: GetInvestmentYearDetailsUseCaseResponse = {
      balance: yearBalance,
      balancePercentage: yearBalancePercentage,
      months: [],
    };

    let monthHoldings = holdings;

    for (const month in operationsByMonth) {
      const { balance, balancePercentage, holdings, totals } = this._balanceCalculator.calculateBalance(
        operationsByMonth[month],
        monthHoldings,
      );

      monthHoldings = holdings;

      response.months.push({
        balance,
        balancePercentage,
        totals,
        month: +month,
      });
    }

    return response;
  }

  private _groupByMonth(operations: Operation[]): Record<number, Operation[]> {
    const operationsByMonth: Record<number, Operation[]> = {};

    for (const operation of operations) {
      const month = operation.date.getMonth() + 1;

      if (!operationsByMonth[month]) operationsByMonth[month] = [];

      operationsByMonth[month].push(operation);
    }

    return operationsByMonth;
  }
}
