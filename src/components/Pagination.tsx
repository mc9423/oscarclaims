import React from 'react';
import { usePagination } from '../hooks/usePagination';
import { PaginationProps } from '../types/table';

interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
}

const PaginationButton = ({
  onClick,
  disabled,
  children,
  className = '',
}: PaginationButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md text-sm font-medium ${
      disabled
        ? 'bg-muted/10 text-muted cursor-not-allowed'
        : 'bg-white text-primary hover:bg-muted/5'
    } ${className}`}
    aria-disabled={disabled}
  >
    {children}
  </button>
);

const Ellipsis = () => (
  <span className="px-3 py-1 text-muted">...</span>
);

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const paginationItems = usePagination(currentPage, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav 
      className="flex justify-center mt-6 mb-6" 
      aria-label="Pagination"
      role="navigation"
    >
      <ul className="flex space-x-1">
        {currentPage > 1 && (
          <li>
            <PaginationButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </PaginationButton>
          </li>
        )}
        
        {paginationItems.map(item => (
          <li key={item.key}>
            {item.type === 'ellipsis' ? (
              <Ellipsis />
            ) : (
              <PaginationButton
                onClick={() => onPageChange(item.number!)}
                disabled={item.number === undefined}
              >
                {item.number}
              </PaginationButton>
            )}
          </li>
        ))}
        
        {currentPage < totalPages && (
          <li>
            <PaginationButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </PaginationButton>
          </li>
        )}
      </ul>
    </nav>
  );
};
