import { useMonthMapper } from "@hooks/useMonthMapper";
import { InvestmentYearDetailsDTO } from "@services/OperationService";
import { InvestmentPeriodCard } from "../../shared/InvestmentPeriodCard";

type InvestmentYearMonthsProps = {
  months: InvestmentYearDetailsDTO["months"];
};

export const InvestmentYearMonths = ({ months }: InvestmentYearMonthsProps) => {
  const { monthMapper } = useMonthMapper();

  const namedMonths = months.map(month => ({
    ...month,
    period: monthMapper[month.month],
  }));

  return (
    <section className="flex gap-4 w-full flex-wrap">
      {namedMonths.map(month => (
        <InvestmentPeriodCard key={month.month} investmentPeriod={month} />
      ))}
    </section>
  );
};
