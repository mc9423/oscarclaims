import { useState, useEffect } from 'react';
import { ClaimStatus } from '../types/claim';
import { useUpdateClaimMutation } from './useClaimsQueries';

export const useClaimStatus = (claimId: string, initialStatus: ClaimStatus | null) => {
  const [status, setStatus] = useState<ClaimStatus | null>(initialStatus);
  const updateClaimMutation = useUpdateClaimMutation();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChange = async (newStatus: ClaimStatus) => {
    try {
      await updateClaimMutation.mutateAsync({
        id: claimId,
        claim: { status: newStatus }
      });
      setStatus(newStatus);
    } catch (err) {
      console.error('Error updating claim status:', err);
    }
  };

  return { status, handleStatusChange };
}; 