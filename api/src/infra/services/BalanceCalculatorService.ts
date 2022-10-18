import {
  AssetCode,
  BalanceCalculatorResponse,
  BalanceCalculatorService,
  Holding,
} from 'src/core/services/BalanceCalculatorService';

import { Operation } from '@entities/Operation';

interface CalculateAssetBalanceResponse {
  balance: number;
  totals: {
    buys: number;
    sells: number;
  };
  holding: Holding;
}

export class BalanceCalculatorServiceImpl implements BalanceCalculatorService {
  calculateBalance(operations: Operation[], holdings: Record<string, Holding>): BalanceCalculatorResponse {
    let yearBalance = 0;

    const operationsByAsset = this._groupByAsset(operations);

    const newHoldings: Record<AssetCode, Holding> = {};

    const yearTotals = { buys: 0, sells: 0 };

    for (const [asset, assetOperations] of operationsByAsset.entries()) {
      const { balance, holding, totals } = this._calculateAssetBalance(assetOperations, holdings[asset]);

      yearBalance += balance;
      yearTotals.buys += totals.buys;
      yearTotals.sells += totals.sells;

      newHoldings[asset] = holding;
    }

    const balancePercentage = (yearTotals.sells / yearTotals.buys) * 100;

    console.log('Balance percentage is nan', isNaN(balancePercentage), balancePercentage);

    return {
      balance: yearBalance,
      holdings: newHoldings,
      totals: yearTotals,
      balancePercentage: isNaN(balancePercentage) ? 0 : balancePercentage,
    };
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

  private _calculateAssetBalance(assetOperations: Operation[], holding?: Holding): CalculateAssetBalanceResponse {
    let averagePrice = holding?.averagePrice ?? 0;
    let assetQuantity = holding?.quantity ?? 0;

    let buys = 0;
    let sells = 0;

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
        buys += operationQuantity * averagePrice;
        sells += operationQuantity * operationValuePerAsset;

        assetBalance += operationQuantity * (operationValuePerAsset - averagePrice);
        assetQuantity -= operationQuantity;
      }
    }

    return { balance: assetBalance, holding: { quantity: assetQuantity, averagePrice }, totals: { buys, sells } };
  }
}
