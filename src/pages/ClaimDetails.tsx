import { useParams, Link } from '@tanstack/react-router';
import { useClaimQuery } from '../hooks/useClaimsQueries';
import { useClaimStatus } from '../hooks/useClaimStatus';
import { useClaimDocuments } from '../hooks/useClaimDocuments';
import { useClaimNotes } from '../hooks/useClaimNotes';
import { ClaimStatus } from '../types/claim';
import { formatDate, formatCurrency } from '../utils/formatters';

const STATUS_COLORS: Record<ClaimStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  in_review: 'bg-blue-100 text-blue-800',
};

export const ClaimDetails = () => {
  const { claimId } = useParams({ from: '/claims/$claimId' });
  const { data: claim, isLoading, isError, error } = useClaimQuery(claimId);
  
  const { status, handleStatusChange } = useClaimStatus(claimId, claim?.status ?? null);
  const { newFiles, isUploading, handleFileChange, handleUploadDocuments } = useClaimDocuments(claimId);
  const { 
    isEditing, 
    notes, 
    setNotes, 
    setIsEditing, 
    handleSaveNotes, 
    handleCancelEdit 
  } = useClaimNotes(claimId, claim?.notes ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" aria-label="Loading claim details"></div>
      </div>
    );
  }
  
  if (isError || !claim) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 p-4 rounded-md" role="alert">
          <h2 className="text-lg font-medium text-red-800">Error loading claim</h2>
          <p className="mt-1 text-sm text-red-700">
            {error instanceof Error ? error.message : 'Claim not found or could not be loaded'}
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className="text-red-600 hover:text-red-800 font-medium"
              aria-label="Return to dashboard"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
            aria-label="Back to claims"
          >
            <svg 
              className="h-5 w-5 mr-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back to Claims
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Claim #{claim.id}
          </h1>
        </div>
        {status && (
          <span 
            className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[status]}`}
            role="status"
            aria-label={`Claim status: ${status}`}
          >
            {status}
          </span>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Claim Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Policyholder</h3>
              <p className="mt-1 text-sm text-gray-900">{claim.policyholderName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Policy Number</h3>
              <p className="mt-1 text-sm text-gray-900">{claim.policyNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
              <p className="mt-1 text-sm text-gray-900">{claim.policyholderEmail}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Phone</h3>
              <p className="mt-1 text-sm text-gray-900">{claim.policyholderPhone || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Incident Date</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(claim.incidentDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(claim.submissionDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Claim Type</h3>
              <p className="mt-1 text-sm text-gray-900">{claim.claimType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Claim Amount</h3>
              <p className="mt-1 text-sm text-gray-900">{formatCurrency(claim.amount)}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">{claim.description}</p>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
                aria-label="Edit notes"
              >
                Edit Notes
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Add notes about this claim..."
                aria-label="Notes content"
              />
              <div className="mt-3 flex justify-end space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  aria-label="Cancel editing notes"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  aria-label="Save notes"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {notes || 'No notes available.'}
            </p>
          )}
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
          
          {claim.documents && claim.documents.length > 0 ? (
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md" role="list">
              {claim.documents.map((doc, index) => {
                const filename = doc.split('/').pop() || `Document ${index + 1}`;
                
                return (
                  <li key={index} className="flex items-center py-3 px-4 text-sm" role="listitem">
                    <svg 
                      className="h-5 w-5 text-gray-400 mr-3" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="truncate flex-1">{filename}</span>
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-indigo-600 hover:text-indigo-800"
                      aria-label={`View ${filename}`}
                    >
                      View
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No documents attached to this claim.</p>
          )}
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Upload Additional Documents</h3>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="document-upload"
                className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Select Files</span>
                <input
                  id="document-upload"
                  name="document-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  aria-label="Upload documents"
                />
              </label>
              {newFiles.length > 0 && (
                <button
                  onClick={handleUploadDocuments}
                  disabled={isUploading}
                  className={`px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isUploading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label={isUploading ? "Uploading documents..." : "Upload documents"}
                  aria-disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
            
            {newFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="mt-1 text-sm text-gray-500" role="list">
                  {newFiles.map((file, index) => (
                    <li key={index} className="flex items-center" role="listitem">
                      <svg 
                        className="h-4 w-4 text-gray-400 mr-1" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            {status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('in_review')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Mark claim as in review"
                >
                  Mark as In Review
                </button>
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-label="Approve claim"
                >
                  Approve Claim
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Reject claim"
                >
                  Reject Claim
                </button>
              </>
            )}
            
            {status === 'in_review' && (
              <>
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-label="Approve claim"
                >
                  Approve Claim
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Reject claim"
                >
                  Reject Claim
                </button>
                <button
                  onClick={() => handleStatusChange('pending')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label="Return claim to pending"
                >
                  Return to Pending
                </button>
              </>
            )}
            
            {(status === 'approved' || status === 'rejected') && (
              <button
                onClick={() => handleStatusChange('pending')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Reopen claim"
              >
                Reopen Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

