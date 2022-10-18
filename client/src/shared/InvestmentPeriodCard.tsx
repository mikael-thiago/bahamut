import { InvestmentDetailsDTO } from "@services/OperationService";
import { MouseEventHandler } from "react";
import classNames from "classnames";
import { useCurrencyFormatter } from "../hooks/useCurrencyFormatter";
import { useBalanceTextColors } from "../hooks/useBalanceTextColors";

export type InvestmentPeriod = {
  period: any; 
} & InvestmentDetailsDTO;

export type InvestmentPeriodCardProps = {
  investmentPeriod: InvestmentPeriod;
  onClick?: MouseEventHandler;
};

export const InvestmentPeriodCard = ({ investmentPeriod, onClick }: InvestmentPeriodCardProps) => {
  const { formatter } = useCurrencyFormatter();
  const { balanceTextColors } = useBalanceTextColors({ balance: investmentPeriod.balance })

  const formattedSells = formatter.format(investmentPeriod.totals.sells);
  const formattedBuys = formatter.format(investmentPeriod.totals.buys);
  const formattedBalance = formatter.format(investmentPeriod.balance);

  const textColorClasses = [
    "text-right",
    balanceTextColors
  ];

  return (
    <div
      className="card flex flex-col w-96 h-96 justify-between cursor-pointer transition-all hover:w-100 hover:h-100"
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold text-right">{investmentPeriod.period}</h2>
      <section className="flex flex-col">
        <span className={classNames("font-bold", ...textColorClasses)}>
          <span>{formattedSells}</span>/<span>{formattedBuys}</span>
        </span>
        <span className={classNames("font-semibold", ...textColorClasses)}>
          {formattedBalance}
        </span>
        <span className={classNames(...textColorClasses)}>
          {investmentPeriod.balancePercentage?.toFixed(2) ?? 0.0}%
        </span>
      </section>
    </div>
  );
};
