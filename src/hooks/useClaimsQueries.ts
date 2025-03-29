import { 
    useQuery, 
    useMutation, 
    useQueryClient,
  } from '@tanstack/react-query';
  import { claimsApi } from '../api/claimsApi';
  import { Claim, ClaimFilters, PaginationParams, SortParams } from '../types/claim';

  export const claimsKeys = {
    all: ['claims'] as const,
    lists: () => [...claimsKeys.all, 'list'] as const,
    list: (filters: ClaimFilters, pagination: PaginationParams, sort: SortParams) => 
      [...claimsKeys.lists(), { filters, pagination, sort }] as const,
    details: () => [...claimsKeys.all, 'detail'] as const,
    detail: (id: string) => [...claimsKeys.details(), id] as const,
  };
  

  export const useClaimsQuery = (
    pagination: PaginationParams,
    sort: SortParams,
    filters: ClaimFilters
  ) => {
    return useQuery({
      queryKey: claimsKeys.list(filters, pagination, sort),
      queryFn: async () => {
        const response = await claimsApi.getClaims();
        

        // in a production environment, we would rely on the API to handle filtering the claims
        // for this, we will just filter the claims here since we know we're only going to have a few claims
        let filteredClaims = response.filter(claim => {
          if (filters.status && claim.status !== filters.status) {
            return false;
          }

          if (filters.dateRange?.start && filters.dateRange?.end) {
            const submissionDate = new Date(claim.submissionDate);
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            if (submissionDate < startDate || submissionDate > endDate) {
              return false;
            }
          }

          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            return (
              claim.id.toLowerCase().includes(searchTerm) ||
              claim.policyholderName.toLowerCase().includes(searchTerm) ||
              claim.policyholderEmail.toLowerCase().includes(searchTerm)
            );
          }

          if (filters.policyholderName) {
            return claim.policyholderName.toLowerCase().includes(filters.policyholderName.toLowerCase());
          }

          return true;
        });
        
        filteredClaims.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sort.direction === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          return 0;
        });
        
        // calculate the start and end indices for the current page
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        
        // slice the claims array to get only the claims for the current page
        const paginatedClaims = filteredClaims.slice(startIndex, endIndex);
        
        return {
          claims: paginatedClaims,
          total: filteredClaims.length
        };
      },
    });
  };
  
  export const useClaimQuery = (id: string) => {
    return useQuery({
      queryKey: claimsKeys.detail(id),
      queryFn: () => claimsApi.getClaimById(id),
      enabled: !!id,
    });
  };
  
  export const useCreateClaimMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (newClaim: Omit<Claim, 'id' | 'submissionDate' | 'status'>) => 
        claimsApi.createClaim(newClaim),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: claimsKeys.lists() });
      },
    });
  };
  
  export const useUpdateClaimMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ id, claim }: { id: string; claim: Partial<Claim> }) => 
        claimsApi.updateClaim(id, claim),
      onSuccess: (updatedClaim) => {
        queryClient.setQueryData(
          claimsKeys.detail(updatedClaim.id),
          updatedClaim
        );
        
        queryClient.invalidateQueries({ queryKey: claimsKeys.lists() });
      },
    });
  };
  
  export const useUploadDocumentMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ claimId, file }: { claimId: string; file: File }) => 
        claimsApi.uploadDocument(claimId, file),
      onSuccess: (_, { claimId }) => {
        queryClient.invalidateQueries({ queryKey: claimsKeys.detail(claimId) });
      },
    });
  };
  