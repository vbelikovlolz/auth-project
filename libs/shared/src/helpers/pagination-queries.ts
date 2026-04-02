import { Injectable } from '@nestjs/common';

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
export type PaginationInput = Partial<PaginationType>;

@Injectable()
export class PaginationService {
  normalizeQueries(paginationQuery: PaginationInput): PaginationType {
    const pageNumber = Math.max(1, Number(paginationQuery.pageNumber) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(paginationQuery.pageSize) || 10),
    );
    const sortBy =
      paginationQuery.sortBy && String(paginationQuery.sortBy).trim()
        ? String(paginationQuery.sortBy)
        : 'createdAt';
    const sortDirection =
      paginationQuery.sortDirection === 'asc' ? 'asc' : 'desc';

    const searchNameTerm = paginationQuery.searchNameTerm
      ? String(paginationQuery.searchNameTerm).trim() || null
      : null;
    const searchLoginTerm = paginationQuery.searchLoginTerm
      ? String(paginationQuery.searchLoginTerm).trim() || null
      : null;
    const searchEmailTerm = paginationQuery.searchEmailTerm
      ? String(paginationQuery.searchEmailTerm).trim() || null
      : null;

    const minAge =
      paginationQuery.minAge !== null && paginationQuery.minAge !== undefined
        ? Math.max(0, Number(paginationQuery.minAge))
        : null;
    const maxAge =
      paginationQuery.maxAge !== null && paginationQuery.maxAge !== undefined
        ? Math.min(150, Number(paginationQuery.maxAge))
        : null;

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
  }
}
