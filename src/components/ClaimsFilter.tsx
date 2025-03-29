import React, { useState } from 'react';
import { ClaimFilters } from '../types/claim';

interface ClaimsFilterProps {
  filters: ClaimFilters;
  onFilterChange: (filters: ClaimFilters) => void;
}

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

const FormInput = ({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  options,
  required = false,
}: FormInputProps) => (
  <div>
    <label 
      htmlFor={id} 
      className="block text-sm font-medium text-muted-dark mb-1"
      id={`${id}-label`}
    >
      {label}
    </label>
    {type === 'select' ? (
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-muted/50 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        aria-labelledby={`${id}-label`}
        aria-required={required}
      >
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-muted/50 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        aria-labelledby={`${id}-label`}
        aria-required={required}
      />
    )}
  </div>
);

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'in_review', label: 'In Review' },
];

export const ClaimsFilter = ({
  filters,
  onFilterChange,
}: ClaimsFilterProps) => {
  const [localFilters, setLocalFilters] = useState<ClaimFilters>({
    ...filters,
    dateRange: filters.dateRange || { start: '', end: '' }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      setLocalFilters(prev => ({
        ...prev,
        dateRange: {
          start: name === 'startDate' ? value : prev.dateRange?.start || '',
          end: name === 'endDate' ? value : prev.dateRange?.end || '',
        },
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // date validation
    if (localFilters.dateRange?.start && localFilters.dateRange?.end) {
      const startDate = new Date(localFilters.dateRange.start);
      const endDate = new Date(localFilters.dateRange.end);
      
      if (startDate > endDate) {
        return;
      }
    }

    const filtersToSubmit = {
      ...localFilters,
      dateRange: localFilters.dateRange?.start && localFilters.dateRange?.end 
        ? localFilters.dateRange 
        : undefined
    };
    onFilterChange(filtersToSubmit);
  };

  const handleReset = () => {
    const resetFilters: ClaimFilters = {
      dateRange: { start: '', end: '' }
    };
    setLocalFilters(resetFilters);
    onFilterChange({});
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-4 rounded-lg shadow-md border border-muted/30 mb-6"
      role="search"
      aria-label="Claims filter form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormInput
          id="search"
          name="search"
          label="Search"
          value={localFilters.search || ''}
          onChange={handleInputChange}
          placeholder="Search by ID, name, or email"
        />

        <FormInput
          id="status"
          name="status"
          label="Status"
          value={localFilters.status || ''}
          onChange={handleInputChange}
          type="select"
          options={STATUS_OPTIONS}
        />

        <FormInput
          id="startDate"
          name="startDate"
          label="From Date"
          value={localFilters.dateRange?.start || ''}
          onChange={handleInputChange}
          type="date"
        />

        <FormInput
          id="endDate"
          name="endDate"
          label="To Date"
          value={localFilters.dateRange?.end || ''}
          onChange={handleInputChange}
          type="date"
        />
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-muted/50 rounded-md text-sm font-medium text-muted hover:bg-muted/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Reset all filters"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Apply filters"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};
