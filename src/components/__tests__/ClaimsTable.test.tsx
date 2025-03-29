import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClaimsTable } from '../ClaimsTable';
import { mockClaims } from '../../test/mocks/claims';
import { Claim } from '../../types/claim';
import { formatCurrency } from '../../utils/formatters';

describe('ClaimsTable', () => {
  const mockOnSort = vi.fn();
  const mockCurrentSort = {
    field: 'id' as keyof Claim,
    direction: 'asc' as const
  };

  const defaultProps = {
    claims: mockClaims,
    isLoading: false,
    onSort: mockOnSort,
    currentSort: mockCurrentSort
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the table with all claims', () => {
    render(<ClaimsTable {...defaultProps} />);
    
    mockClaims.forEach(claim => {
      expect(screen.getByText(claim.id)).toBeInTheDocument();
      expect(screen.getByText(claim.policyholderName)).toBeInTheDocument();
      expect(screen.getByText(formatCurrency(claim.amount))).toBeInTheDocument();
    });
  });

  it('handles sorting when clicking column headers', () => {
    render(<ClaimsTable {...defaultProps} />);
    
    const claimIdHeader = screen.getByRole('columnheader', { name: /claim id/i });
    fireEvent.click(claimIdHeader);
    expect(mockOnSort).toHaveBeenCalledWith('id', 'desc');
  });

  it('displays loading state', () => {
    render(<ClaimsTable {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('status', { name: /loading claims/i })).toBeInTheDocument();
  });

  it('displays empty state', () => {
    render(<ClaimsTable {...defaultProps} claims={[]} />);
    expect(screen.getByRole('status', { name: /no claims found/i })).toBeInTheDocument();
  });

  it('displays correct dates in the expected format', () => {
    render(<ClaimsTable {...defaultProps} />);
    
    // Each date appears twice - once in incident date column and once in submission date column
    expect(screen.getAllByText('Mar 15, 2024')).toHaveLength(2);
    expect(screen.getAllByText('Mar 16, 2024')).toHaveLength(2);
    expect(screen.getAllByText('Mar 17, 2024')).toHaveLength(2);
  });
}); 