export const useBalanceTextColors = ({ balance }: { balance: number }) => {
  const isPositiveBalance = balance > 0;
  const isNegativeBalance = balance < 0;
  const balanceTextColors = {
    "text-danger": isNegativeBalance,
    "text-success": isPositiveBalance,
  };

  return {
    balanceTextColors,
  };
};
