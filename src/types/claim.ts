export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'in_review';

export interface Claim {
  id: string;
  policyNumber: string;
  policyholderName: string;
  policyholderEmail: string;
  policyholderPhone: string;
  incidentDate: string;
  submissionDate: string;
  status: ClaimStatus;
  claimType: string;
  description: string;
  amount: number;
  documents?: string[];
  notes?: string;
  assignedTo?: string;
}

export interface ClaimFilters {
  search?: string;
  status?: ClaimStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  policyholderName?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: keyof Claim;
  direction: 'asc' | 'desc';
}

export interface ClaimsResponse {
  claims: Claim[];
  total: number;
}
