import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  isUploading = false,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/json',
    'text/html',
  ],
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files (too large, wrong type, etc.)
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((file) => {
          const error = file.errors[0];
          if (error.code === 'file-too-large') {
            return `${file.file.name} is too large. Max size is ${formatBytes(maxSize)}.`;
          }
          if (error.code === 'file-invalid-type') {
            return `${file.file.name} has an invalid file type.`;
          }
          return `${file.file.name}: ${error.message}`;
        });
        setError(errors.join(' '));
        return;
      }

      // Clear any previous errors
      setError(null);

      // Update selected files
      setSelectedFiles(acceptedFiles);

      // Call the onUpload callback immediately
      onUpload(acceptedFiles);
    },
    [onUpload, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
  });

  // Format bytes to human-readable format
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or <span className="text-primary-600 dark:text-primary-400">browse files</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Max file size: {formatBytes(maxSize)} | Max files: {maxFiles}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Files ({selectedFiles.length})
          </h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-secondary-800 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(file.size)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Uploading...</span>
        </div>
      )}
    </div>
  );
};

// Import missing DocumentIcon
import { DocumentIcon } from '@heroicons/react/24/outline';
