
import React from 'react';

const HospitalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <path d="M12 12h.01" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <HospitalIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-slate-800">
              MedUnited Hospitals <span className="font-light text-slate-500">| Care Dashboard</span>
            </span>
          </div>
          {/* Add user profile/actions here if needed in the future */}
        </div>
      </div>
    </header>
  );
};
