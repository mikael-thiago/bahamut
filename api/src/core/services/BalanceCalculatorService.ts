import { Operation } from '@entities/Operation';

export type AssetCode = string;

export interface Holding {
  quantity: number;
  averagePrice: number;
}

export type BalanceCalculatorTotals = { buys: number; sells: number };

export type BalanceCalculatorResponse = {
  balancePercentage: number;
  balance: number;
  holdings: Record<AssetCode, Holding>;
  totals: BalanceCalculatorTotals;
};

export abstract class BalanceCalculatorService {
  abstract calculateBalance(operations: Operation[], holdings: Record<AssetCode, Holding>): BalanceCalculatorResponse;
}
