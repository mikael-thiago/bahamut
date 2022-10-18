import { CircularProgress } from "@chakra-ui/react";
import {
  Operation,
  OperationSortColumn,
  SortDirection,
  useOperationService,
} from "@services/OperationService";
import { OperationsTable } from "@shared/OperationsTable";
import { PageParams, SortParams } from "@shared/types";
import { useEffect, useState } from "react";

const useInvestmentYearOperations = ({ year }: { year: number }) => {
  const [operations, setOperations] = useState<Operation[] | null>(null);
  const [sortParams, setSortParams] = useState<SortParams<OperationSortColumn>>({});
  const [pageParams, setPageParams] = useState<PageParams & { totalPages: number }>({
    page: 1,
    pageSize: 5,
    totalPages: 0,
  });

  const { getYearOperationsPaged: getOperationsPaged } = useOperationService();

  useEffect(() => {loadOperations({})}, []);

  const loadOperations = ({
    page = pageParams.page,
    pageSize = pageParams.pageSize,
    ...rest
  }: SortParams<OperationSortColumn> & Partial<PageParams>) => {
    let { sortColumn, sortDirection } = rest;
    sortColumn = "sortColumn" in rest ? sortColumn : sortParams.sortColumn;
    sortDirection = "sortDirection" in rest ? sortDirection : sortParams.sortDirection;

    return getOperationsPaged({ year: +year, page, pageSize, sortColumn, sortDirection }).then(
      ({ items, totalPages }) => {
        setOperations(items);
        setSortParams({ sortColumn, sortDirection });
        setPageParams({ page, pageSize, totalPages });
      }
    );
  };

  return { operations, sortParams, pageParams, loadOperations };
};

type InvestmentYearOperationsProps = {
  year: number;
};

export const InvestmentYearOperations = ({ year }: InvestmentYearOperationsProps) => {
  const { operations, sortParams, pageParams, loadOperations } = useInvestmentYearOperations({ year });

  const isLoading = !operations;

  return (
    <section>
      <h2 className="mb-5 font-bold text-xl">Operações</h2>
      {isLoading && <CircularProgress isIndeterminate />}
      {!isLoading && (
        <OperationsTable
          operations={operations}
          onSorting={loadOperations}
          onPagination={page => loadOperations({ page })}
          {...sortParams}
          {...pageParams}
        />
      )}
    </section>
  );
};
