import { Claim, ClaimStatus } from './claim';

export interface ClaimsTableProps {
  claims: Claim[];
  isLoading: boolean;
  onSort: (field: keyof Claim, direction: 'asc' | 'desc') => void;
  currentSort: { field: keyof Claim; direction: 'asc' | 'desc' };
}

export type StatusClasses = Record<ClaimStatus, string>;

export interface SortDirection {
  asc: string;
  desc: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
} 