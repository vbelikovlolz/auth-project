import { paginationType } from '../../types/pagination-type';

export const paginationQueries = (paginationQuery): paginationType => {
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
  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
    searchLoginTerm,
    searchEmailTerm,
  };
};
