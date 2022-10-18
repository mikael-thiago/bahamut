import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { SortDirection } from "@services/OperationService";
import { SortParams } from "@shared/types";

export const useTableSorting = <T,>(
  curr: SortParams<T>,
  onSorting?: (params: SortParams<T>) => any
) => {
  const toggleColumn = (column: T) => {
    let direction;
    
    if (!curr || curr.sortColumn !== column || curr.sortDirection === undefined) direction = SortDirection.Asc;
    else if (curr.sortDirection === SortDirection.Asc) direction = SortDirection.Desc;
    else direction = undefined;
    

    onSorting?.({
      sortColumn: direction === undefined ? undefined : column,
      sortDirection: direction,
    });
  };

  const DirectionIcon = ({sortColumn}: {sortColumn?: T}) => {
    if (!sortColumn || !curr.sortColumn || sortColumn !== curr.sortColumn) return null;

    if (curr.sortDirection === SortDirection.Asc) return <ArrowUpIcon />;

    return <ArrowDownIcon />
  }

  return {
    toggleColumn,
    DirectionIcon
  };
};