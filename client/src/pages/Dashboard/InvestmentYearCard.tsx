import { InvestmentYear } from "@services/OperationService";
import { MouseEventHandler } from "react";
import classNames from "classnames";

export type InvestmentYearCardProps = {
  investmentYear: InvestmentYear;
  onClick?: MouseEventHandler;
};

export const InvestmentYearCard = ({ investmentYear, onClick }: InvestmentYearCardProps) => {
  const isPositiveBalance = investmentYear.balance > 0;
  const isNegativeBalance = investmentYear.balance < 0;

  const textColorClasses = [
    "text-right",
    {
      "text-danger": isNegativeBalance,
      "text-success": isPositiveBalance,
    },
  ];

  return (
    <div
      className="card flex flex-col w-96 h-96 justify-between cursor-pointer transition-all hover:w-100 hover:h-100"
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold text-right">{investmentYear.year}</h2>
      <section className="flex flex-col">
        <span className={classNames("font-bold", ...textColorClasses)}>
          <span>R${investmentYear.totals.sells.toFixed(2)}</span>/
          <span>R${investmentYear.totals.buys.toFixed(2)}</span>
        </span>
        <span className={classNames("font-semibold", ...textColorClasses)}>
          R${investmentYear.balance.toFixed(2)}
        </span>
        <span className={classNames("text-sm", ...textColorClasses)}>
          {investmentYear.balancePercentage.toFixed(2)}%
        </span>
      </section>
    </div>
  );
};
