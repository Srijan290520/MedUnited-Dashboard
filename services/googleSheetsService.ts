import type { PatientData } from '../types';

// The URL for the deployed Google Apps Script Web App.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxFcMPXzauNtp4uY9WwjsFrRPp0oXJhGoAUlv440RVObqBNSv58Wnjq4fYVmLtJmNLB/exec';

/**
 * Fetches paginated patient data from the Google Sheet via the Apps Script API.
 * @param page The current page number to fetch.
 * @param limit The number of records per page.
 * @returns A promise that resolves with the patient data, total pages, and total records.
 */
export const getPatientData = async (
  page: number,
  limit: number
): Promise<{ records: PatientData[]; totalPages: number; totalRecords: number }> => {
  const url = new URL(SCRIPT_URL);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(limit));

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    const data = await response.json();

    // Check for application-level errors returned by the script
    if (data.error) {
      console.error("Google Apps Script Error:", data.details || data.error);
      throw new Error(data.details || data.error);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch patient data:", error);
    // Re-throw the error to be caught by the calling component (App.tsx)
    throw error;
  }
};

/**
 * Updates a patient record in the Google Sheet via the Apps Script API.
 * @param updatedPatient The patient data object to update.
 * @returns A promise that resolves when the update is complete.
 */
export const updatePatientRecord = async (updatedPatient: PatientData): Promise<void> => {
  const payload = {
    action: 'update',
    data: updatedPatient,
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result = await response.json();
    if (result.error) {
        throw new Error(result.details || result.error);
    }
    if (!result.success) {
      throw new Error(result.message || 'The API indicated the update failed.');
    }
  } catch (error) {
    console.error("Failed to update patient record:", error);
    throw error;
  }
};

/**
 * Appends multiple new patient records to the Google Sheet.
 * @param records An array of new patient records to add.
 * @returns A promise that resolves when the append operation is complete.
 */
export const appendPatientRecords = async (records: Omit<PatientData, 'id' | 'rowNumber'>[]): Promise<void> => {
    const payload = {
        action: 'append',
        data: records,
    };

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) {
            throw new Error(result.details || result.error);
        }
        if (!result.success) {
            throw new Error(result.message || 'The API indicated the append operation failed.');
        }
    } catch (error) {
        console.error("Failed to append patient records:", error);
        throw error;
    }
};