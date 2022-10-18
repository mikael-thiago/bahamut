import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useCurrencyFormatter } from "@hooks/useCurrencyFormatter";
import { useTableSorting } from "@hooks/useTable";
import {
  Operation,
  OperationSortColumn,
  OperationType,
  SortDirection,
} from "@services/OperationService";
import { useEffect, useState } from "react";
import { Pagination } from "./Pagination";

type OperationsTableProps = {
  operations: Operation[];

  page: number;
  totalPages: number;

  sortColumn?: OperationSortColumn;
  sortDirection?: SortDirection;

  onPagination?: (page: number) => any;
  onSorting?: (sorting: { sortColumn?: OperationSortColumn; sortDirection?: SortDirection }) => any;
};

const OperationTableRow = ({ operation }: { operation: Operation }) => {
  const { formatter } = useCurrencyFormatter();

  return (
    <Tr>
      <Td>{operation.assetCode}</Td>
      <Td>{operation.quantity}</Td>
      <Td>{formatter.format(operation.valuePerAsset)}</Td>
      <Td>{formatter.format(operation.quantity * operation.valuePerAsset)}</Td>
      <Td>{operation.date.toLocaleString()}</Td>
      <Td>{operation.type === OperationType.Buying ? "Compra" : "Venda"}</Td>
    </Tr>
  );
};

export const OperationsTable = ({
  operations,
  onSorting,
  sortColumn,
  sortDirection,
  page,
  totalPages,
  onPagination,
}: OperationsTableProps) => {
  const { toggleColumn, DirectionIcon } = useTableSorting<OperationSortColumn>(
    {
      sortColumn,
      sortDirection,
    },
    onSorting
  );

  return <>
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th onClick={() => toggleColumn(OperationSortColumn.AssetCode)}>
              <DirectionIcon sortColumn={OperationSortColumn.AssetCode} /> Ativo
            </Th>
            <Th onClick={() => toggleColumn(OperationSortColumn.Quantity)}>
              <DirectionIcon sortColumn={OperationSortColumn.Quantity} />
              Quantidade
            </Th>
            <Th>Valor p/ ativo</Th>
            <Th>Total</Th>
            <Th onClick={() => toggleColumn(OperationSortColumn.Date)}>
              <DirectionIcon sortColumn={OperationSortColumn.Date} />
              Data
            </Th>
            <Th onClick={() => toggleColumn(OperationSortColumn.Type)}>
              <DirectionIcon sortColumn={OperationSortColumn.Type} />
              Tipo
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {operations.map(operation => (
            <OperationTableRow key={operation.id} operation={operation} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>

    <div className="w-full flex justify-center mt-2">
      <Pagination
        page={page}
        totalPages={totalPages}
        maxShowPages={5}
        onChange={page => onPagination?.(page)}
      />
    </div>
  </>;
};
