import { Operation } from '@entities/Operation';
import { OperationRepository } from '../repositories/OperationRepository';
import { UseCase } from '../shared/UseCase';
import { UserKeyType } from '@entities/User';

//------------------------- DEFINITION -------------------------------------------//
export type ListInvestmentYearsRequest = {
  userId: UserKeyType;
};

export type ListInvestmentYearsResponse = { year: number; balance: number }[];

export abstract class ListInvestmentYearsUseCase
  implements UseCase<ListInvestmentYearsRequest, ListInvestmentYearsResponse>
{
  abstract execute(request: ListInvestmentYearsRequest): Promise<ListInvestmentYearsResponse>;
}

interface Holding {
  quantity: number;
  averagePrice: number;
}

type AssetCode = string;
//------------------------- END DEFINITION -------------------------------------------//

export class ListInvestmentYearsUseCaseImpl implements ListInvestmentYearsUseCase {
  constructor(private _operationRepository: OperationRepository) {}

  async execute(request: ListInvestmentYearsRequest): Promise<ListInvestmentYearsResponse> {
    const { userId } = request;

    const operationsByYear = await this._operationRepository.getOperationsGroupedByYear({
      userId,
    });

    const balanceByYear: ListInvestmentYearsResponse = [];

    let holdings: Record<AssetCode, Holding> = {};

    for (const year in operationsByYear) {
      const yearOperations = operationsByYear[year];
      const { balance, holdings: lastHoldings } = this._calculateYearBalance(yearOperations, holdings);

      balanceByYear.push({ year: +year, balance });
      holdings = lastHoldings;
    }

    return balanceByYear;
  }

  private _groupByAsset(yearOperations: Operation[]): Map<AssetCode, Operation[]> {
    const operationsByAsset = new Map<AssetCode, Operation[]>();

    for (const operation of yearOperations) {
      const assetCode = operation.assetCode;

      const isAssetRegistered = operationsByAsset.has(assetCode);

      if (!isAssetRegistered) operationsByAsset.set(assetCode, []);

      operationsByAsset.get(assetCode)?.push(operation);
    }

    return operationsByAsset;
  }

  private _calculateAssetBalance(
    assetOperations: Operation[],
    holding?: Holding,
  ): {
    balance: number;
    holding: Holding;
  } {
    let averagePrice = holding?.averagePrice ?? 0;
    let assetQuantity = holding?.quantity ?? 0;

    let assetBalance = 0;

    for (const operation of assetOperations) {
      const operationQuantity = operation.quantity;
      const operationValuePerAsset = operation.valuePerAsset;

      if (operation.isBuying) {
        averagePrice =
          (averagePrice * assetQuantity + operationQuantity * operationValuePerAsset) /
          (assetQuantity + operationQuantity);

        assetQuantity += operationQuantity;
      }

      if (operation.isSelling) {
        assetBalance += operationQuantity * (operationValuePerAsset - averagePrice);
        assetQuantity -= operationQuantity;
      }
    }

    return { balance: assetBalance, holding: { quantity: assetQuantity, averagePrice } };
  }

  private _calculateYearBalance(
    yearOperations: Operation[],
    holdings: Record<AssetCode, Holding> = {},
  ): { balance: number; holdings: Record<AssetCode, Holding> } {
    let yearBalance = 0;

    const operationsByAsset = this._groupByAsset(yearOperations);
    const newHoldings: Record<AssetCode, Holding> = {};

    for (const [asset, assetOperations] of operationsByAsset.entries()) {
      const { balance, holding } = this._calculateAssetBalance(assetOperations, holdings[asset]);

      yearBalance += balance;

      newHoldings[asset] = holding;
    }

    return { balance: yearBalance, holdings: newHoldings };
  }
}
