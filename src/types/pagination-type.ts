export type paginationType = {
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
