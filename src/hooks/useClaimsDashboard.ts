import { useState } from 'react';
import { ClaimFilters, PaginationParams, SortParams, Claim } from '../types/claim';
import { useClaimsQuery } from './useClaimsQueries';

export const useClaimsDashboard = () => {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  
  const [sort, setSort] = useState<SortParams>({
    field: 'submissionDate',
    direction: 'desc',
  });
  
  const [filters, setFilters] = useState<ClaimFilters>({});
  
  const { data } = useClaimsQuery(pagination, sort, filters);
  const totalPages = data ? Math.ceil(data.total / pagination.pageSize) : 0;
  
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const handleSortChange = (field: keyof Claim, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };
  
  const handleFilterChange = (newFilters: ClaimFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    setPagination({ page: 1, pageSize: newPageSize });
  };

  return {
    pagination,
    sort,
    filters,
    totalPages,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handlePageSizeChange,
  };
}; 