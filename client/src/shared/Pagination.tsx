import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import classNames from "classnames";
import { useEffect, useMemo, useRef } from "react";

const DEFAULT_MAX_SHOW_PAGES = 5;

const generatePagesArray = ({
  page,
  maxShowPages,
  maxPage,
}: {
  page: number;
  maxShowPages: number;
  maxPage: number;
}) => {
  const pages = [];

  for (let i = page; i < page + maxShowPages && i <= maxPage; i++) pages.push(i);

  return pages;
};

const range = (from: number, to: number) => {
  const range = [];

  for (let i = from; i <= to; i++)
    range.push(i);

  return range;
}

type PaginationProps = {
  maxShowPages?: number;
  totalPages: number;

  page: number;
  onChange: (page: number) => any;
};

const PageItem = ({
  page,
  onClick,
  active = false,
}: {
  page: number;
  active?: boolean;
  onClick?: (page: number) => any;
}) => {
  const classes = classNames("px-4 text-lg hover:bg-violet-800 rounded cursor-pointer", {
    "bg-violet-800": active,
  });

  return (
    <div className={classes} onClick={() => onClick?.(page)}>
      {page}
    </div>
  );
};

export const Pagination = ({ page, maxShowPages = DEFAULT_MAX_SHOW_PAGES, totalPages, onChange }: PaginationProps) => {
  const allPagesArray = useMemo(() => range(1, totalPages), [totalPages]);

  const pagesArray = useMemo(() => allPagesArray.slice(
    page < maxShowPages ? 0 : page - maxShowPages + 1,
    page < maxShowPages ? maxShowPages : page + 1
  ), [allPagesArray, page, maxShowPages]);

  const nextPage = Math.min(totalPages, page + 1);
  const previousPage = Math.max(1, page - 1);

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex justify-between items-center gap-3 px-4 py-2">
      {!isFirstPage && <ChevronLeftIcon
        className="cursor-pointer hover:bg-violet-800 rounded"
        w={6}
        h={6}
        onClick={() => onChange?.(previousPage)}
      />}

      <div className="flex gap-2">
        {pagesArray.map(arrPage => (
          <PageItem key={arrPage} page={arrPage} onClick={onChange} active={arrPage === page} />
        ))}
      </div>
      {!isLastPage && <ChevronRightIcon
        className="cursor-pointer hover:bg-violet-800 rounded"
        w={6}
        h={6}
        onClick={() => onChange?.(nextPage)}
      />}
    </div>
  );
};
