import React from 'react';
import { CallStatus } from '../types';

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);


interface FilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  doctorFilter: string;
  onDoctorFilterChange: (value: string) => void;
  visitTypeFilter: string;
  onVisitTypeFilterChange: (value: string) => void;
  uniqueDoctors: string[];
  onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm, onSearchTermChange,
  statusFilter, onStatusFilterChange,
  doctorFilter, onDoctorFilterChange,
  visitTypeFilter, onVisitTypeFilterChange,
  uniqueDoctors,
  onClearFilters,
}) => {
  const callStatusOptions = Object.values(CallStatus);
  const hasActiveFilters = !!(searchTerm || statusFilter || doctorFilter || visitTypeFilter);

  return (
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700">Search by Name or ID</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="e.g., John Doe or KIMS-12345"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700">Call Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Statuses</option>
            {callStatusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="doctorFilter" className="block text-sm font-medium text-slate-700">Doctor</label>
          <select
            id="doctorFilter"
            value={doctorFilter}
            onChange={(e) => onDoctorFilterChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Doctors</option>
            {uniqueDoctors.map(doctor => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end gap-2">
           <div className="flex-grow">
              <label htmlFor="visitTypeFilter" className="block text-sm font-medium text-slate-700">Visit Type</label>
              <select
                id="visitTypeFilter"
                value={visitTypeFilter}
                onChange={(e) => onVisitTypeFilterChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="IPD">IPD</option>
                <option value="OPD">OPD</option>
              </select>
           </div>
           
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              title="Clear Filters"
              className="p-2 mt-1 h-[38px] bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 transition"
              aria-label="Clear all filters"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
