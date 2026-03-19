import { paginationType } from '../../types/pagination-type';

export interface PaginationQuery {
  pageNumber?: string | number;
  pageSize?: string | number;
  sortBy?: string;
  sortDirection?: string;
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  minAge?: string | number;
  maxAge?: string | number;
}

export const paginationQueries = (
  paginationQuery: paginationType,
): paginationType => {
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
