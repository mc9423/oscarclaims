import { useState } from 'react';
import { useUploadDocumentMutation } from './useClaimsQueries';

export const useClaimDocuments = (claimId: string) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadDocumentMutation = useUploadDocumentMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleUploadDocuments = async () => {
    if (newFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = newFiles.map(file => 
        uploadDocumentMutation.mutateAsync({ claimId, file })
      );
      
      await Promise.all(uploadPromises);
      setNewFiles([]);
    } catch (err) {
      console.error('Error uploading documents:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    newFiles,
    isUploading,
    handleFileChange,
    handleUploadDocuments,
  };
}; 