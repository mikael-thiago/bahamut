import { InvestmentYear, useOperationService } from "../../services/OperationService";
import { useEffect, useState } from "react";

import { CircularProgress } from "@chakra-ui/react";
import { InvestmentYearCard } from "./InvestmentYearCard";
import { useNavigate } from "react-router-dom";

const useInvestmentYears = () => {
  const [investmentYears, setInvestmentYears] = useState<null | InvestmentYear[]>(null);
  const { getInvestmentYears } = useOperationService();

  useEffect(() => {
    getInvestmentYears().then(investmentYears => setInvestmentYears(investmentYears));
  }, []);

  return { investmentYears };
};

const useNavigateToYearDetails = () => {
  const navigate = useNavigate();

  const navigateToYearDetails = (year: number) => navigate(`/year/${year}`);

  return { navigateToYearDetails };
};

export const Dashboard = () => {
  const { investmentYears } = useInvestmentYears();
  const { navigateToYearDetails } = useNavigateToYearDetails();

  return (
    <div className="w-full h-full flex gap-6">
      {investmentYears &&
        investmentYears.map(investmentYear => (
          <InvestmentYearCard
            investmentYear={investmentYear}
            onClick={() => navigateToYearDetails(investmentYear.year)}
          />
        ))}
      {!investmentYears && <CircularProgress isIndeterminate />}
    </div>
  );
};
