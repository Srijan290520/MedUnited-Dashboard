import React from 'react';

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

const RefreshCwIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

interface SheetConfigurationErrorProps {
  onRetry: () => void;
}

export const SheetConfigurationError: React.FC<SheetConfigurationErrorProps> = ({ onRetry }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 shadow-md rounded-r-lg">
      <div className="flex">
        <div className="py-1">
          <AlertTriangleIcon className="h-8 w-8 text-yellow-500 mr-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-800">Google Sheet Configuration Error</h2>
          <p className="mt-2 text-yellow-700">
            The application failed to connect to your Google Sheet because it could not find a sheet (tab) named exactly <strong className="font-mono bg-yellow-200 px-1 py-0.5 rounded">'PatientData'</strong>.
          </p>
          <div className="mt-4">
            <h3 className="font-semibold text-yellow-800">How to Fix:</h3>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-yellow-700">
              <li>Open your Google Sheet.</li>
              <li>Look at the tabs at the very bottom of the page.</li>
              <li>Find the sheet containing your patient data and double-click its name.</li>
              <li>Rename it to <strong className="font-mono bg-yellow-200 px-1 py-0.5 rounded">PatientData</strong>. The name is case-sensitive.</li>
            </ol>
          </div>
          <div className="mt-5">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition"
            >
              <RefreshCwIcon className="h-5 w-5" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
