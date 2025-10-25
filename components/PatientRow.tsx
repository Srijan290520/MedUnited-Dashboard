
import React, { useState, useEffect } from 'react';
import type { PatientData, PatientType } from '../types';
import { calculateDaysSince, getCallStatus, formatDate, getStatusColorClasses, getTodayLocalDateString } from '../utils/dateUtils';
import { Spinner } from './Spinner';

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);
const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);
const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);


interface PatientRowProps {
  patient: PatientData;
  onUpdatePatient: (patient: PatientData) => Promise<boolean>;
}

export const PatientRow: React.FC<PatientRowProps> = ({ patient, onUpdatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOutcomeSaving, setIsOutcomeSaving] = useState(false);
  const [editableData, setEditableData] = useState(patient);

  useEffect(() => {
    setEditableData(patient);
  }, [patient]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditableData(patient);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onUpdatePatient(editableData);
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableData(prev => ({ ...prev, [name]: value }));
  };

  const handleOutcomeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOutcome = e.target.value;
    
    if (newOutcome === patient.callOutcome) return;

    setIsOutcomeSaving(true);
    
    const updatedPatient: PatientData = {
      ...patient,
      callOutcome: newOutcome,
      callDate: patient.callDate || getTodayLocalDateString(),
      agentName: patient.agentName || 'System Update',
    };

    await onUpdatePatient(updatedPatient);
    setIsOutcomeSaving(false);
  };

  // Based on user feedback, visit type might be in `department` field if `patientType` is not set.
  const visitType: PatientType = (patient.patientType === 'OPD' || patient.patientType === 'IPD') ? patient.patientType : patient.department as PatientType;

  const callStatus = getCallStatus(patient.lastVisitDate, visitType, patient.callOutcome);
  const daysSinceVisit = calculateDaysSince(patient.lastVisitDate);

  const callOutcomes = ["Feedback Positive", "Feedback Negative", "No Answer", "Call Later", "Wrong Number"];
  
  const patientTypeColorClasses = visitType === 'IPD' 
    ? 'bg-purple-100 text-purple-800' 
    : 'bg-cyan-100 text-cyan-800';

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-900">{patient.patientName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {patient.patientId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        {patient.doctorName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(patient.lastVisitDate)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patientTypeColorClasses}`}>
          {visitType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClasses(callStatus)}`}>
          {callStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{daysSinceVisit} days</td>
      
      {/* Editable Fields */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
           <select 
              name="callOutcome" 
              value={editableData.callOutcome || ""} 
              onChange={isEditing ? handleChange : handleOutcomeChange}
              disabled={isOutcomeSaving || isSaving} 
              className="w-full p-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Outcome</option>
              {callOutcomes.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {isOutcomeSaving && <Spinner size="sm" />}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input type="text" name="agentName" value={editableData.agentName} onChange={handleChange} className="w-full p-1 border border-slate-300 rounded-md text-sm" />
        ) : (
          <span className="text-sm text-slate-900">{patient.agentName || 'N/A'}</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input type="date" name="callDate" value={editableData.callDate || ''} onChange={handleChange} className="w-full p-1 border border-slate-300 rounded-md text-sm" />
        ) : (
          <span className="text-sm text-slate-500">{formatDate(patient.callDate)}</span>
        )}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <textarea name="notes" value={editableData.notes} onChange={handleChange} rows={2} className="w-full p-1 border border-slate-300 rounded-md text-sm min-w-[200px]" />
        ) : (
          <p className="text-sm text-slate-500 truncate max-w-xs">{patient.notes || 'N/A'}</p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={isSaving} className="text-green-600 hover:text-green-900 disabled:text-slate-400 disabled:cursor-not-allowed">
              {isSaving ? <Spinner size="sm"/> : <SaveIcon className="h-5 w-5" />}
            </button>
            <button onClick={handleCancel} className="text-slate-600 hover:text-slate-900">
              <XIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button onClick={handleEdit} className="text-blue-600 hover:text-blue-900">
            <EditIcon className="h-5 w-5" />
          </button>
        )}
        </div>
      </td>
    </tr>
  );
};
