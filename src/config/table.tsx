import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { Claim, ClaimStatus } from '../types/claim';
import { formatDate, formatCurrency } from '../utils/formatters';

export const SORT_DIRECTIONS = {
  asc: '↑',
  desc: '↓',
} as const;

const statusClasses: Record<ClaimStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  in_review: 'bg-blue-100 text-blue-800',
};

export const TABLE_COLUMNS: ColumnDef<Claim>[] = [
  {
    accessorKey: 'id',
    header: 'Claim ID',
    cell: info => (
      <Link 
        to="/claims/$claimId" 
        params={{ claimId: info.getValue<string>() }}
        className="text-blue-600 hover:underline"
        aria-label={`View claim ${info.getValue<string>()}`}
      >
        {info.getValue<string>()}
      </Link>
    ),
  },
  {
    accessorKey: 'policyholderName',
    header: 'Policyholder',
  },
  {
    accessorKey: 'incidentDate',
    header: 'Incident Date',
    cell: info => formatDate(info.getValue<string>()),
  },
  {
    accessorKey: 'submissionDate',
    header: 'Submission Date',
    cell: info => formatDate(info.getValue<string>()),
  },
  {
    accessorKey: 'claimType',
    header: 'Type',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: info => formatCurrency(info.getValue<number>()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => {
      const status = info.getValue<ClaimStatus>();
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );
    },
  },
]; 