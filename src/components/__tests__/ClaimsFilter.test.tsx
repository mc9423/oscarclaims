import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClaimsFilter } from '../ClaimsFilter';
import { ClaimFilters } from '../../types/claim';

describe('ClaimsFilter', () => {
  const mockOnFilterChange = vi.fn();

  const defaultFilters: ClaimFilters = {
    search: '',
    status: undefined,
    dateRange: undefined
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter inputs', () => {
    render(
      <ClaimsFilter
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('From Date')).toBeInTheDocument();
    expect(screen.getByLabelText('To Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('handles status filter changes', () => {
    render(
      <ClaimsFilter
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'approved' } });
    
    // Submit the form to trigger onFilterChange
    const submitButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(submitButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      status: 'approved',
      dateRange: undefined
    });
  });

  it('handles date range filter changes', () => {
    render(
      <ClaimsFilter
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const startDate = screen.getByLabelText('From Date');
    const endDate = screen.getByLabelText('To Date');
    
    fireEvent.change(startDate, { target: { value: '2024-03-01' } });
    fireEvent.change(endDate, { target: { value: '2024-03-31' } });
    
    // Submit the form to trigger onFilterChange
    const submitButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(submitButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      status: undefined,
      dateRange: {
        start: '2024-03-01',
        end: '2024-03-31'
      }
    });
  });

  it('handles search input changes', () => {
    render(
      <ClaimsFilter
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'John Doe' } });
    
    // Submit the form to trigger onFilterChange
    const submitButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(submitButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'John Doe',
      status: undefined,
      dateRange: undefined
    });
  });

  it('clears filters when reset button is clicked', () => {
    render(
      <ClaimsFilter
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });
}); 