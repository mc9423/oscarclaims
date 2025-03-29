import { Link } from '@tanstack/react-router';
import { ClaimsTable } from '../components/ClaimsTable';
import { ClaimsFilter } from '../components/ClaimsFilter';
import { Pagination } from '../components/Pagination';
import { useClaimsQuery } from '../hooks/useClaimsQueries';
import { useClaimsDashboard } from '../hooks/useClaimsDashboard';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const ClaimsDashboard = () => {
  const {
    pagination,
    sort,
    filters,
    totalPages,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handlePageSizeChange,
  } = useClaimsDashboard();

  const { data, isLoading, isError, error } = useClaimsQuery(pagination, sort, filters);

  if (isError) {
    return (
      <div 
        className="bg-red-50 p-4 rounded-md"
        role="alert"
        aria-live="polite"
      >
        <h2 className="text-lg font-medium text-red-800">Error loading claims</h2>
        <p className="mt-1 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="container mx-auto px-4 py-8"
      role="main"
      aria-label="Claims Dashboard"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-muted-dark">Insurance Claims</h1>
        <Link
          to="/claims/new"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Submit new claim"
        >
          Submit New Claim
        </Link>
      </div>
      
      <ClaimsFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div 
        className="bg-white shadow-md border border-muted/30 rounded-lg overflow-hidden"
        role="region"
        aria-label="Claims table"
      >
        <div className="flex justify-end p-4 border-b border-muted/40">
          <div className="flex items-center space-x-2">
            <label 
              htmlFor="pageSize" 
              className="text-sm text-muted"
              id="pageSize-label"
            >
              Show:
            </label>
            <select
              id="pageSize"
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              className="border border-muted/50 rounded-md text-sm p-1 focus:outline-none focus:ring-primary focus:border-primary"
              aria-labelledby="pageSize-label"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <ClaimsTable
          claims={data?.claims ?? []}
          isLoading={isLoading}
          onSort={handleSortChange}
          currentSort={sort}
        />
        
        {totalPages > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
