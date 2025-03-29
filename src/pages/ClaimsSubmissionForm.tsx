import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateClaimMutation, useUploadDocumentMutation } from '../hooks/useClaimsQueries';
import { Claim } from '../types/claim';
import { Input } from '../components/ui/input';

type ClaimFormData = Omit<Claim, 'id' | 'submissionDate' | 'status'>;

export const ClaimSubmissionForm = () => {
    const navigate = useNavigate();
    const createClaimMutation = useCreateClaimMutation();
    const uploadDocumentMutation = useUploadDocumentMutation();
    
    const [formData, setFormData] = useState<ClaimFormData>({
      policyNumber: '',
      policyholderName: '',
      policyholderEmail: '',
      policyholderPhone: '',
      incidentDate: '',
      claimType: '',
      description: '',
      amount: 0,
      notes: '',
    });
    
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // required fields
    // form libraries tend to handle validation more elegantly, but for this project, we'll just do it manually
    if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
    if (!formData.policyholderName) newErrors.policyholderName = 'Policyholder name is required';
    if (!formData.policyholderEmail) newErrors.policyholderEmail = 'Email is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    if (!formData.claimType) newErrors.claimType = 'Claim type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than zero';
    
    if (
        formData.policyholderEmail && 
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.policyholderEmail)
      ) {
        newErrors.policyholderEmail = 'Invalid email address';
      }
      
      if (
        formData.policyholderPhone && 
        !/^\+?[0-9]{10,15}$/.test(formData.policyholderPhone.replace(/[\s()-]/g, ''))
      ) {
        newErrors.policyholderPhone = 'Invalid phone number';
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const incidentDate = new Date(formData.incidentDate);
      
      if (incidentDate > today) {
        newErrors.incidentDate = 'Incident date cannot be in the future';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const newClaim = await createClaimMutation.mutateAsync(formData);
        
        const documentPromises = files.map(file => 
          uploadDocumentMutation.mutateAsync({ claimId: newClaim.id, file })
        );
        
        if (documentPromises.length > 0) {
          await Promise.all(documentPromises);
        }
        
        navigate({ to: '/claims/$claimId', params: { claimId: newClaim.id } });
      } catch (error) {
        console.error('Error submitting claim:', error);
        setErrors(prev => ({
          ...prev,
          form: 'An error occurred while submitting your claim. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Submit New Insurance Claim</h1>
          <p className="mt-2 text-gray-600">
            Please fill out the form below with all required information about your claim.
          </p>
        </div>
        
        {errors.form && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Policyholder Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="policyNumber"
              name="policyNumber"
              label="Policy Number *"
              value={formData.policyNumber}
              onChange={handleInputChange}
              error={errors.policyNumber}
            />
            
            <Input
              id="policyholderName"
              name="policyholderName"
              label="Full Name *"
              value={formData.policyholderName}
              onChange={handleInputChange}
              error={errors.policyholderName}
            />
            
            <Input
              id="policyholderEmail"
              name="policyholderEmail"
              type="email"
              label="Email Address *"
              value={formData.policyholderEmail}
              onChange={handleInputChange}
              error={errors.policyholderEmail}
            />
            
            <Input
              id="policyholderPhone"
              name="policyholderPhone"
              type="tel"
              label="Phone Number"
              value={formData.policyholderPhone}
              onChange={handleInputChange}
              placeholder="e.g., +1 (555) 123-4567"
              error={errors.policyholderPhone}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Claim Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="incidentDate"
              name="incidentDate"
              type="date"
              label="Incident Date *"
              value={formData.incidentDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              error={errors.incidentDate}
            />
            
            <div>
              <label htmlFor="claimType" className="block text-sm font-medium text-gray-700 mb-1">
                Claim Type *
              </label>
              <select
                id="claimType"
                name="claimType"
                value={formData.claimType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.claimType ? 'border-red-300' : 'border-gray-300'
                }`}
                aria-invalid={errors.claimType ? 'true' : 'false'}
                aria-describedby={errors.claimType ? 'claimType-error' : undefined}
              >
                <option value="">Select claim type</option>
                <option value="Auto">Auto</option>
                <option value="Home">Home</option>
                <option value="Health">Health</option>
                <option value="Life">Life</option>
                <option value="Property">Property</option>
                <option value="Liability">Liability</option>
                <option value="Other">Other</option>
              </select>
              {errors.claimType && (
                <p id="claimType-error" className="mt-1 text-sm text-red-600">
                  {errors.claimType}
                </p>
              )}
            </div>
            
            <Input
              id="amount"
              name="amount"
              type="number"
              label="Claim Amount ($) *"
              value={formData.amount || ''}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              error={errors.amount}
            />
          </div>
          
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description of Incident *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'description-error' : undefined}
              placeholder="Please provide details about the incident..."
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>
          
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any additional information you'd like to provide..."
            />
          </div>
        </div>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h2>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                />
                </label>
                <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                PNG, JPG, PDF, DOC up to 10MB each
                </p>
                </div>
                </div>

                {files.length > 0 && (
                <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Selected files:</h3>
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between py-2 px-4 text-sm">
                <div className="flex items-center">
                    <svg 
                    className="h-5 w-5 text-gray-400 mr-2" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    >
                    <path 
                        fillRule="evenodd" 
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                        clipRule="evenodd" 
                    />
                    </svg>
                    <span className="truncate max-w-xs">{file.name}</span>
                    <span className="ml-2 text-gray-500 text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={`Remove file ${file.name}`}
                >
                    <svg 
                    className="h-5 w-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    >
                    <path 
                        fillRule="evenodd" 
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                    />
                    </svg>
                </button>
                </li>
                ))}
                </ul>
                </div>
                )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Required fields
                </div>
                <div className="flex space-x-3">
                <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                </button>
                </div>
                </div>
                </form>
                </div>
                );
                };