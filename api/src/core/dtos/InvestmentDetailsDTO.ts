export interface InvestmentDetailsDTO {
  balance: number;
  balancePercentage: number;
  totals: { buys: number; sells: number };
}
