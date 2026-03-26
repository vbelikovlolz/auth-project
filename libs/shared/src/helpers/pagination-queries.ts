export type PaginationType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  searchNameTerm: string | null;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  minAge: number | null;
  maxAge: number | null;
};

export const paginationQueries = (
  paginationQuery: PaginationType,
): PaginationType => {
  const pageNumber = paginationQuery.pageNumber
    ? +paginationQuery.pageNumber
    : 1;
  const pageSize = paginationQuery.pageSize ? +paginationQuery.pageSize : 10;
  const sortBy = paginationQuery.sortBy
    ? String(paginationQuery.sortBy)
    : 'createdAt';
  const sortDirection =
    paginationQuery.sortDirection === 'asc' ? 'asc' : 'desc';
  const searchNameTerm = paginationQuery.searchNameTerm
    ? String(paginationQuery.searchNameTerm)
    : null;
  const searchLoginTerm = paginationQuery.searchLoginTerm
    ? String(paginationQuery.searchLoginTerm)
    : null;
  const searchEmailTerm = paginationQuery.searchEmailTerm
    ? String(paginationQuery.searchEmailTerm)
    : null;
  const minAge = paginationQuery.minAge ? +paginationQuery.minAge : null;

  const maxAge = paginationQuery.maxAge ? +paginationQuery.maxAge : null;
  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
    searchLoginTerm,
    searchEmailTerm,
    minAge,
    maxAge,
  };
};
