import { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { Claim } from '../types/claim';
import { ClaimsTableProps } from '../types/table';
import { TABLE_COLUMNS, SORT_DIRECTIONS } from '../config/table';

const LoadingState = () => (
  <div 
    className="flex justify-center p-8" 
    role="status"
    aria-label="Loading claims"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const EmptyState = () => (
  <div 
    className="text-center p-8"
    role="status"
    aria-label="No claims found"
  >
    No claims found matching your criteria.
  </div>
);

export const ClaimsTable = ({
  claims,
  isLoading,
  onSort,
  currentSort,
}: ClaimsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: currentSort.field as string, desc: currentSort.direction === 'desc' }
  ]);

  useEffect(() => {
    setSorting([
      { id: currentSort.field as string, desc: currentSort.direction === 'desc' }
    ]);
  }, [currentSort]);

  const table = useReactTable({
    data: claims,
    columns: TABLE_COLUMNS,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      
      if (newSorting.length > 0) {
        onSort(
          newSorting[0].id as keyof Claim,
          newSorting[0].desc ? 'desc' : 'asc'
        );
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (claims.length === 0) {
    return <EmptyState />;
  }

  return (
    <div 
      className="overflow-x-auto"
      role="region"
      aria-label="Claims table"
    >
      <table 
        className="min-w-full divide-y divide-muted/40"
        role="table"
        aria-label="Claims list"
      >
        <thead className="bg-muted/10">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer border-b border-muted/40"
                  onClick={header.column.getToggleSortingHandler()}
                  role="columnheader"
                  aria-sort={header.column.getIsSorted() ? 
                    (header.column.getIsSorted() === 'asc' ? 'ascending' : 'descending') : 
                    'none'
                  }
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-1" aria-hidden="true">
                      {SORT_DIRECTIONS[header.column.getIsSorted() as keyof typeof SORT_DIRECTIONS] ?? null}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-muted/40">
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id}
              className="hover:bg-muted/10 transition-colors"
              role="row"
            >
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id} 
                  className="px-6 py-4 whitespace-nowrap"
                  role="cell"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

