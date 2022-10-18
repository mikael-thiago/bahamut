import { InvestmentYearDetailsDTO, Operation, useOperationService } from "@services/OperationService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InvestmentYearMonths } from "./InvestmentYearMonths";
import { Button, CircularProgress } from "@chakra-ui/react";
import { InvestmentYearBalance } from "./InvestmentYearBalance";
import { useOperationModalContainer } from "@shared/OperationModal/hooks";
import { InvestmentYearOperations } from "./InvestmentYearOperations";

const useInvestmentYear = () => {
  const [investmentYear, setInvestmentYear] = useState<InvestmentYearDetailsDTO | null>(null);

  const { year } = useParams();
  const { getInvestmentYearDetails } = useOperationService();

  useEffect(() => {
    if (!year) return;

    getInvestmentYearDetails({ year: +year }).then(setInvestmentYear);
  }, []);

  return {
    investmentYear,
    isLoading: !investmentYear,
    year: +year!,
  };
};

const useInvestmentYearOperations = () => {
  const [operations, setOperations] = useState<Operation[] | null>(null);

  const { year } = useParams();
  const { getYearOperationsPaged: getOperationsPaged } = useOperationService();

  useEffect(() => {
    if (!year) return;

    getOperationsPaged({ year: +year, page: 1, pageSize: 10 }).then(({ items }) => setOperations(items));
  }, [])


  return { operations };
}

export const InvestmentYearDetails = () => {
  const { investmentYear, isLoading, year } = useInvestmentYear();
  const { openOperationModal, OperationModal } = useOperationModalContainer();
  const { operations } = useInvestmentYearOperations();

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress isIndeterminate />
        </div>
      )}
      {investmentYear && (
        <div className="w-full p-6 px-12">
          <div className="flex justify-between w-full">
            <div className="mb-8">
              <h1 className="text-6xl font-bold mb-3">{year}</h1>
              <InvestmentYearBalance
                balance={investmentYear.balance}
                balancePercentage={investmentYear.balancePercentage}
              />
            </div>

            <Button size="lg" onClick={openOperationModal}>
              Cadastrar operação
            </Button>
          </div>
          
          <InvestmentYearMonths months={investmentYear.months} />

          <hr className="my-5 invisible" />

          <InvestmentYearOperations year={year} />
        </div>
      )}

      <OperationModal selectedYear={year} />
    </>
  );
};
