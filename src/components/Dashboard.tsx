import React from 'react';
import type { PatientData } from '../types';
import { Pagination } from './Pagination';
import { PatientTable } from './PatientTable';

interface DashboardProps {
  patients: PatientData[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onUpdatePatient: (patient: PatientData) => Promise<boolean>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  currentPage,
  totalPages,
  totalRecords,
  rowsPerPage,
  onPageChange,
  onUpdatePatient,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <PatientTable patients={patients} onUpdatePatient={onUpdatePatient} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};
