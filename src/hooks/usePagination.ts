import { useMemo } from 'react';

interface PaginationItem {
  type: 'page' | 'ellipsis';
  number?: number;
  key: string;
}

export const usePagination = (currentPage: number, totalPages: number) => {
  return useMemo(() => {
    // always show first page, last page, current page, and 1 page before and after current
    const showPageNumbers = new Set<number>();
    showPageNumbers.add(1); 
    showPageNumbers.add(totalPages); 
    showPageNumbers.add(currentPage); 
    
    if (currentPage > 1) showPageNumbers.add(currentPage - 1);
    if (currentPage < totalPages) showPageNumbers.add(currentPage + 1);
    
    const pagesToShow = Array.from(showPageNumbers).sort((a, b) => a - b);
    
    const paginationItems: PaginationItem[] = [];
    let prevPage = 0;
    
    for (const page of pagesToShow) {
      if (page - prevPage > 1) {
        paginationItems.push({ type: 'ellipsis', key: `ellipsis-${prevPage}-${page}` });
      }
      paginationItems.push({ type: 'page', number: page, key: `page-${page}` });
      prevPage = page;
    }

    return paginationItems;
  }, [currentPage, totalPages]);
}; 