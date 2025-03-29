import { useState, useEffect } from 'react';
import { useUpdateClaimMutation } from './useClaimsQueries';

export const useClaimNotes = (claimId: string, initialNotes: string = '') => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const updateClaimMutation = useUpdateClaimMutation();

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSaveNotes = async () => {
    try {
      await updateClaimMutation.mutateAsync({
        id: claimId,
        claim: { notes }
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating claim notes:', err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNotes(initialNotes);
  };

  return {
    isEditing,
    notes,
    setNotes,
    setIsEditing,
    handleSaveNotes,
    handleCancelEdit,
  };
}; 