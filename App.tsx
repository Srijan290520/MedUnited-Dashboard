import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';
import { FileUpload } from './components/FileUpload';
import { getPatientData, updatePatientRecord, appendPatientRecords } from './services/googleSheetsService';
import { SheetConfigurationError } from './components/SheetConfigurationError';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FilterControls } from './components/FilterControls';
import { getCallStatus } from './utils/dateUtils';
import type { PatientData, PatientType } from './types';

type View = 'data' | 'analytics';

const App: React.FC = () => {
  const [allPatients, setAllPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeView, setActiveView] = useState<View>('data');

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>('');


  const ROWS_PER_PAGE = 50;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsConfigError(false);
    try {
      // Fetch a large number of records to get all data for client-side filtering.
      const data = await getPatientData(1, 10000); 
      setAllPatients(data?.records || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (errorMessage.includes('Sheet') && errorMessage.includes('not found')) {
        setError(`Configuration error: A sheet named "PatientData" was not found. Please follow the steps below.`);
        setIsConfigError(true);
      } else {
        setError(`Failed to fetch patient data. Please check your connection and try again. Details: ${errorMessage}`);
      }
      console.error(err);
      setAllPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Filtering Logic ---

  const uniqueDoctors = useMemo(() => {
    const doctorSet = new Set<string>();
    allPatients.forEach(p => {
        if (p.doctorName) doctorSet.add(p.doctorName.trim());
    });
    return Array.from(doctorSet).sort();
  }, [allPatients]);
  
  const filteredPatients = useMemo(() => {
    return allPatients.filter(patient => {
        // Accommodate cases where visit type might be in `department` field
        const visitType: PatientType = (patient.patientType === 'OPD' || patient.patientType === 'IPD') ? patient.patientType : patient.department as PatientType;

        const callStatus = getCallStatus(patient.lastVisitDate, visitType, patient.callOutcome);
        
        const matchesSearchTerm = searchTerm === '' ||
            patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = statusFilter === '' || callStatus === statusFilter;
        const matchesDoctor = doctorFilter === '' || patient.doctorName === doctorFilter;
        const matchesVisitType = visitTypeFilter === '' || visitType === visitTypeFilter;

        return matchesSearchTerm && matchesStatus && matchesDoctor && matchesVisitType;
    });
  }, [allPatients, searchTerm, statusFilter, doctorFilter, visitTypeFilter]);
  
  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, doctorFilter, visitTypeFilter]);

  // --- Pagination Logic for Filtered Data ---

  const totalFilteredRecords = filteredPatients.length;
  const totalFilteredPages = Math.ceil(totalFilteredRecords / ROWS_PER_PAGE);

  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredPatients.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredPatients, currentPage]);


  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalFilteredPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUpdatePatient = async (updatedPatient: PatientData): Promise<boolean> => {
    try {
      await updatePatientRecord(updatedPatient);
      setAllPatients(prevAllPatients =>
        prevAllPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
      );
      showNotification('Patient record updated successfully.', 'success');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      showNotification(`Update failed: ${errorMessage}`, 'error');
      console.error(err);
      return false;
    }
  };

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setError(null);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
        if (rows.length < 2) {
          throw new Error("CSV file is empty or contains only a header row.");
        }
        const headers = rows[0].split(',').map(h => h.trim());
        const records = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            let value = values[index] ? values[index].trim() : '';
            if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1).replace(/""/g, '"');
            }
            obj[header] = value;
            return obj;
          }, {} as any);
        });

        await appendPatientRecords(records);
        showNotification(`${records.length} records uploaded successfully!`, 'success');
        setCurrentPage(1);
        await fetchAllData(); // Refetch all data after upload
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during file processing.';
        showNotification(`Upload failed: ${errorMessage}`, 'error');
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
        showNotification('Failed to read the selected file.', 'error');
        setIsUploading(false);
    };

    reader.readAsText(file);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDoctorFilter('');
    setVisitTypeFilter('');
  };

  const NotificationBanner = () => {
    if (!notification) return null;
    const isError = notification.type === 'error';
    const baseClasses = "px-4 py-3 rounded relative mb-4";
    const colorClasses = isError 
      ? "bg-red-100 border border-red-400 text-red-700"
      : "bg-green-100 border border-green-400 text-green-700";

    return (
        <div className={`${baseClasses} ${colorClasses}`} role="alert">
            <strong className="font-bold">{isError ? "Error: " : "Success: "}</strong>
            <span className="block sm:inline">{notification.message}</span>
        </div>
    );
  };
  
  const PageControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {activeView === 'data' ? 'Patient Feedback Calls' : 'Analytics Dashboard'}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {activeView === 'data' 
            ? 'Manage and track outbound calls to patients for feedback.'
            : 'View summary reports and performance metrics.'
          }
        </p>
      </div>
       <div className="flex items-center gap-4">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          {activeView === 'data' && <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />}
       </div>
    </div>
  );

  const ViewSwitcher: React.FC<{ activeView: View; onViewChange: (view: View) => void; }> = ({ activeView, onViewChange }) => (
    <div className="flex items-center p-1 bg-slate-200 rounded-lg">
      <button 
        onClick={() => onViewChange('data')}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeView === 'data' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}
      >
        Patient Data
      </button>
      <button 
        onClick={() => onViewChange('analytics')}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeView === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}
      >
        Dashboard
      </button>
    </div>
  );

  const handleRetry = () => {
    fetchAllData();
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Spinner />
        </div>
      );
    }
    if (isConfigError) {
      return <SheetConfigurationError onRetry={handleRetry} />;
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      );
    }

    if (activeView === 'analytics') {
       return <AnalyticsDashboard allPatientsData={allPatients} />;
    }

    return currentTableData.length > 0 || (searchTerm || statusFilter || doctorFilter || visitTypeFilter) ? (
      <Dashboard
        patients={currentTableData}
        currentPage={currentPage}
        totalPages={totalFilteredPages}
        totalRecords={totalFilteredRecords}
        onPageChange={handlePageChange}
        onUpdatePatient={handleUpdatePatient}
        rowsPerPage={ROWS_PER_PAGE}
      />
    ) : (
      <div className="bg-white shadow-md rounded-lg p-8 text-center text-slate-500">
        <h2 className="text-xl font-semibold">
          {allPatients.length > 0 ? 'No Matching Patients Found' : 'No Patient Data Found'}
        </h2>
        <p className="mt-2">
          {allPatients.length > 0 ? 'Try adjusting your filters or upload a new CSV file.' : 'Please upload a CSV file to get started.'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <NotificationBanner />
        <PageControls />
        {activeView === 'data' && !loading && !error && (
            <FilterControls
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                doctorFilter={doctorFilter}
                onDoctorFilterChange={setDoctorFilter}
                visitTypeFilter={visitTypeFilter}
                onVisitTypeFilterChange={setVisitTypeFilter}
                uniqueDoctors={uniqueDoctors}
                onClearFilters={handleClearFilters}
            />
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
