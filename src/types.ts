
export enum CallStatus {
  Overdue = 'Overdue',
  NeedActionToday = 'Need Action Today',
  Upcoming = 'Upcoming',
  Completed = 'Completed',
}

export type PatientType = 'OPD' | 'IPD';

export interface PatientData {
  id: string;
  rowNumber: number;
  patientId: string;
  patientName: string;
  doctorName: string;
  lastVisitDate: string; // ISO date string e.g., "2023-10-27"
  department: string;
  patientType: PatientType;
  callOutcome: string;
  agentName: string;
  callDate: string | null; // ISO date string or null
  notes: string;
}
