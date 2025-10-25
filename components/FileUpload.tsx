
import React, { useRef } from 'react';
import { Spinner } from './Spinner';

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
);


interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset file input to allow uploading the same file again
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv"
        disabled={isUploading}
      />
      <button
        onClick={handleClick}
        disabled={isUploading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 w-36 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        {isUploading ? <Spinner size="sm" /> : <UploadIcon className="h-5 w-5" />}
        {isUploading ? 'Uploading...' : 'Upload Data'}
      </button>
    </div>
  );
};
