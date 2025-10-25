
import type { PatientType } from '../types';
import { CallStatus } from '../types';

/**
 * Parses a 'YYYY-MM-DD' string into a Date object in the user's local timezone.
 * This prevents issues where `new Date('YYYY-MM-DD')` is interpreted as UTC midnight,
 * which can result in the date being off by one day in certain timezones.
 * @param dateString The date string to parse.
 * @returns A local Date object.
 */
const parseDateStringAsLocal = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Month is 0-indexed in JavaScript's Date constructor (0 for January).
    return new Date(year, month - 1, day);
};

export const calculateDaysSince = (dateString: string): number => {
  const visitDate = parseDateStringAsLocal(dateString);
  const today = new Date();
  // Reset time to midnight to compare dates only
  visitDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - visitDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getCallStatus = (
  lastVisitDate: string,
  patientType: PatientType,
  callOutcome: string
): CallStatus => {
  // Define outcomes that signify a final, terminal state for the call task.
  // Outcomes like "No Answer" or "Call Later" require follow-up and are not "Completed".
  const terminalOutcomes = ["Feedback Positive", "Feedback Negative", "Wrong Number"];

  if (terminalOutcomes.includes(callOutcome)) {
    return CallStatus.Completed;
  }

  const daysToCall = patientType === 'OPD' ? 1 : 3;
  const visitDate = parseDateStringAsLocal(lastVisitDate);
  const callDate = new Date(visitDate);
  callDate.setDate(visitDate.getDate() + daysToCall);
  
  const today = new Date();
  // Reset time to midnight for accurate date comparison
  callDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today.getTime() > callDate.getTime()) {
    return CallStatus.Overdue;
  } else if (today.getTime() === callDate.getTime()) {
    return CallStatus.NeedActionToday;
  } else {
    return CallStatus.Upcoming;
  }
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    // Parse the date string and re-format it locally to avoid timezone shifts
    // caused by methods like toISOString().
    const date = parseDateStringAsLocal(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    // Fallback to the original string if parsing fails for any reason.
    return dateString;
  }
};

/**
 * Gets the current date in the user's local timezone and returns it as a 'YYYY-MM-DD' string.
 * @returns Today's date string.
 */
export const getTodayLocalDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export const getStatusColorClasses = (status: CallStatus): string => {
  switch (status) {
    case CallStatus.Overdue:
      return 'bg-red-100 text-red-800';
    case CallStatus.NeedActionToday:
      return 'bg-yellow-100 text-yellow-800';
    case CallStatus.Upcoming:
      return 'bg-blue-100 text-blue-800';
    case CallStatus.Completed:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};
