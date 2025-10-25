
import React from 'react';
import type { PatientData } from '../types';
import { PatientRow } from './PatientRow';

interface PatientTableProps {
  patients: PatientData[];
  onUpdatePatient: (patient: PatientData) => Promise<boolean>;
}

export const PatientTable: React.FC<PatientTableProps> = ({ patients, onUpdatePatient }) => {
  const headers = [
    "Patient Name", "Patient ID", "Doctor Name", "Last Visit", "Visit Type", "Call Status", "Days Since Visit", 
    "Call Outcome", "Agent", "Call Date", "Notes", "Actions"
  ];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {headers.map(header => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {patients.map(patient => (
            <PatientRow
              key={patient.id}
              patient={patient}
              onUpdatePatient={onUpdatePatient}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
