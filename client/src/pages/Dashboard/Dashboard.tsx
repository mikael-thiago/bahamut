import { InvestmentYear, useOperationService } from "@services/OperationService";
import { useEffect, useState } from "react";

import { CircularProgress } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { NoYearsInvested } from "./NoYearsInvested";
import { InvestmentPeriodCard } from "@shared/InvestmentPeriodCard";
import { useOperationModalContainer } from "@shared/OperationModal/hooks";

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
  const { OperationModal, openOperationModal } = useOperationModalContainer();

  const hasInvestmentYearsLoaded = !!investmentYears;
  const hasInvestmentYears = hasInvestmentYearsLoaded && !!investmentYears.length;

  return (
    <div className="w-full h-full flex justify-center items-center p-6 gap-6">
      {!hasInvestmentYearsLoaded && <CircularProgress isIndeterminate />}

      {hasInvestmentYears &&
        investmentYears.map(investmentYear => (
          <InvestmentPeriodCard
            key={investmentYear.year}
            investmentPeriod={{ ...investmentYear, period: investmentYear.year }}
            onClick={() => navigateToYearDetails(investmentYear.year)}
          />
        ))}
      {hasInvestmentYearsLoaded && !hasInvestmentYears && (
        <NoYearsInvested onAddOperation={openOperationModal} />
      )}

      <OperationModal />
    </div>
  );
};
