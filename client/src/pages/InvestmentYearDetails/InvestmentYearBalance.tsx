import classNames from 'classnames';
import React from 'react'
import { useBalanceTextColors } from '@hooks/useBalanceTextColors';
import { useCurrencyFormatter } from '@hooks/useCurrencyFormatter';

type InvestmentYearBalanceProps = {
  balance: number;
  balancePercentage: number;
}

export const InvestmentYearBalance = ({ balance, balancePercentage }: InvestmentYearBalanceProps) => {
  const { formatter } = useCurrencyFormatter();
  const { balanceTextColors } = useBalanceTextColors({ balance });
  
  const textColorClasses = [
    "text-xl",
    "font-semibold",
    balanceTextColors
  ];

  const formatedBalance = formatter.format(balance);

  return (
    <>
      <div className={classNames(textColorClasses)}>{formatedBalance}</div>
      <div className={classNames(textColorClasses)}>{balancePercentage.toFixed(2)}%</div>
    </>
  );
}