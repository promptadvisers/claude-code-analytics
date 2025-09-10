import React, { useState, useRef } from 'react';
import analyticsAPI from '../services/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a CSV file.',
      });
      return;
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size must be less than 16MB.',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const response = await analyticsAPI.uploadFile(file);
      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${response.records} records. Backup saved as ${response.backup_file}`,
      });
      onUploadSuccess();
    } catch (error: any) {
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to upload file. Please try again.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 scale-105' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Uploading and processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isDragging ? 'Drop your CSV file here' : 'Upload New Data'}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <div className="text-sm text-gray-400">
              <p>• CSV files only</p>
              <p>• Maximum file size: 16MB</p>
              <p>• Must contain: Sale_ID, Date, Units_Sold, Price_Per_Unit, Revenue, Region, Sales_Channel</p>
            </div>
          </div>
        )}

        {/* Overlay effect */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary-500 bg-opacity-10 rounded-2xl flex items-center justify-center">
            <div className="text-primary-600 font-semibold text-lg">
              Drop file to upload
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {uploadStatus.type && (
        <div
          className={`
            p-4 rounded-xl border transition-all duration-300 animate-slide-up
            ${uploadStatus.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }
          `}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              {uploadStatus.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-sm">{uploadStatus.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;