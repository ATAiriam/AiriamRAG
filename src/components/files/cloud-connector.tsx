import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  FolderIcon,
  ArrowLeftIcon,
  CheckIcon,
  DocumentIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface CloudFile {
  id: string;
  name: string;
  isFolder: boolean;
  modifiedDate: string;
  size?: number;
  type?: string;
}

interface CloudConnectorProps {
  provider: 'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint';
  onSelectFiles: (provider: 'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint', fileIds: string[]) => void;
  onCancel: () => void;
}

export const CloudConnector: React.FC<CloudConnectorProps> = ({
  provider,
  onSelectFiles,
  onCancel,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Provider names for display
  const providerNames = {
    'google-drive': 'Google Drive',
    onedrive: 'OneDrive',
    dropbox: 'Dropbox',
    sharepoint: 'SharePoint',
  };

  // Mock authentication process
  const authenticate = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // This would normally connect to the cloud provider API
      // For now, we'll just simulate an authentication process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      await fetchFiles('/');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Mock file fetching process
  const fetchFiles = async (path: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // This would normally fetch files from the cloud provider API
      // For now, we'll just simulate a file list
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock file list
      const mockFiles: CloudFile[] = [];
      
      if (path !== '/') {
        // Add some folders
        for (let i = 1; i <= 3; i++) {
          mockFiles.push({
            id: `folder-${path}-${i}`,
            name: `Folder ${i}`,
            isFolder: true,
            modifiedDate: new Date(Date.now() - i * 86400000).toISOString(),
          });
        }
      }

      // Add some files
      const fileTypes = ['pdf', 'docx', 'xlsx', 'pptx', 'txt'];
      for (let i = 1; i <= 5; i++) {
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        mockFiles.push({
          id: `file-${path}-${i}`,
          name: `Example File ${i}.${fileType}`,
          isFolder: false,
          modifiedDate: new Date(Date.now() - i * 86400000).toISOString(),
          size: Math.floor(Math.random() * 10000000), // Random size up to 10MB
          type: fileType,
        });
      }

      setFiles(mockFiles);
      setCurrentPath(path);

      // Update path history for navigation
      if (path !== currentPath) {
        if (path === '/') {
          setPathHistory([]);
        } else if (currentPath === '/') {
          setPathHistory(['/']);
        } else {
          setPathHistory([...pathHistory, currentPath]);
        }
      }
    } catch (err) {
      setError('Failed to fetch files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to the previous folder
  const goBack = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setPathHistory(pathHistory.slice(0, -1));
      fetchFiles(previousPath);
    }
  };

  // Handle file selection
  const toggleFileSelection = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined) return '';
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle folder click
  const handleFolderClick = (folderId: string) => {
    const folderPath = `${currentPath === '/' ? '' : currentPath}/${folderId}`;
    fetchFiles(folderPath);
  };

  // Handle file import
  const handleImportFiles = () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to import.');
      return;
    }

    onSelectFiles(provider, selectedFiles);
  };

  // Filter files based on search query
  const filteredFiles = searchQuery
    ? files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  // Mock provider-specific icons
  const ProviderIcon = () => {
    switch (provider) {
      case 'google-drive':
        return (
          <svg className="h-8 w-8 text-[#4285F4]" viewBox="0 0 87.3 78" fill="currentColor">
            {/* Google Drive Icon */}
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3.3.2.6.35.95.5L33.65 52 6.6 66.85Z" fill="#0066DA"/>
            <path d="m43.65 25-10-17.4-10 17.4 10 17.4 17.4-10.15c-.05-.4-.05-.85-.05-1.25s0-.85.05-1.25L43.65 25Z" fill="#00AC47"/>
            <path d="M73.55 76.8c1.4-.8 2.5-1.95 3.3-3.3l3.85-6.65L54.35 52.5 43.6 77h.05c.35-.15.65-.3.95-.5l28.95-19.7Z" fill="#EA4335"/>
            <path d="M43.65 25 26.25 14.85a8.54 8.54 0 0 0-.95.5 9.16 9.16 0 0 0-3.3 3.3L6.6 45.2c-.8 1.4-1.25 3-1.25 4.65s.45 3.2 1.25 4.65L33.7 40 43.65 25Z" fill="#00832D"/>
            <path d="m80.7 45.2-15.4-26.55a9.13 9.13 0 0 0-3.3-3.3c-.3-.2-.6-.35-.95-.5L43.65 25 54.35 41.5l27.1 14.5c.8-1.45 1.25-3.05 1.25-4.65s-.45-3.25-1.25-4.65l-.75-1.5Z" fill="#2684FC"/>
            <path d="M43.65 25 61.05 14.85c-.3-.15-.6-.3-.95-.5-1.7-.95-3.7-1.5-5.75-1.5s-4.05.55-5.75 1.5c-.3.2-.65.35-.95.5l-10 17.4 6 10.35L43.65 25Z" fill="#FFBA00"/>
          </svg>
        );
      case 'onedrive':
        return (
          <svg className="h-8 w-8 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
            {/* OneDrive Icon */}
            <path d="M10.5 14.669c1.72.31 3.352.154 4.624-.47 1.4-.69 2.23-1.92 2.23-3.33 0-3.12-3.26-4.81-6.43-4.81-2.19 0-4.11 1.96-5.07 3.29-.4.55-1.39 1.9-1A80.366 80.366 0 0 0 4.878 6c-.057 0-.11.005-.164.011C2.23 6.147.672 7.88.672 9.932c0 1.97 1.29 3.6 3.1 4.28.335.118 1.585.457 4.888.457h1.84z" />
            <path d="M20.229 14.009c1.695 0 3.1-1.41 3.1-3.11 0-1.38-.92-2.58-2.2-2.97-.31-1.29-1.27-2.38-2.65-2.82-.27-.08-.54-.13-.81-.13-1.18 0-2.27.63-2.87 1.63-.4-.27-.88-.4-1.37-.4-.73 0-1.4.31-1.87.82L11.24 9c1.1-.03 2.23.13 3.32.5s2.08 1.04 2.74 1.9c-.002.056-.005.105-.005.153 0 .96.55 1.84 1.42 2.27.473.218.998.186 1.51.186z" />
          </svg>
        );
      case 'dropbox':
        return (
          <svg className="h-8 w-8 text-[#0061FF]" viewBox="0 0 24 24" fill="currentColor">
            {/* Dropbox Icon */}
            <path d="m12 14.56 4.24-2.68L24 15.56l-7.76 4.48L12 17.24l-4.24 2.8L0 15.56l7.76-3.68L12 14.56zM7.76 4.96 12 7.76l4.24-2.8L24 8.96l-7.76 4.48L12 10.64l-4.24 2.8L0 8.96l7.76-4z" />
          </svg>
        );
      case 'sharepoint':
        return (
          <svg className="h-8 w-8 text-[#038387]" viewBox="0 0 24 24" fill="currentColor">
            {/* SharePoint Icon */}
            <path d="M9.99 0C6.137 0 3 3.137 3 6.99v.02C1.167 7.66 0 9.67 0 12c0 3.314 2.686 6 6 6h14c2.21 0 4-1.79 4-4 0-1.826-1.244-3.36-2.934-3.82.147-.563.214-1.155.205-1.75C21.272 3.825 17.217-.074 13-.074L9.99 0zM12 7h6v4h-2v6h-3v-6H8v6H5v-6H3V7h4V3h1l4 4z" />
          </svg>
        );
      default:
        return <FolderIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <ProviderIcon />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                Connect to {providerNames[provider]}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                You need to authenticate to access your {providerNames[provider]} files.
              </p>
              {error && (
                <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </div>
              )}
              <Button
                variant="primary"
                fullWidth
                isLoading={isAuthenticating}
                onClick={authenticate}
              >
                Connect to {providerNames[provider]}
              </Button>
              <Button variant="ghost" fullWidth onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ProviderIcon />
              <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {providerNames[provider]}
              </h3>
            </div>
            <Input
              placeholder="Search files..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={goBack}
              disabled={pathHistory.length === 0}
            >
              Back
            </Button>
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {currentPath === '/' ? 'Root Directory' : currentPath}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-gray-700 dark:text-gray-300">Loading files...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No files found
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-secondary-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        onChange={(e) => {
                          const nonFolderFiles = filteredFiles
                            .filter((file) => !file.isFolder)
                            .map((file) => file.id);
                          
                          if (e.target.checked) {
                            setSelectedFiles(nonFolderFiles);
                          } else {
                            setSelectedFiles([]);
                          }
                        }}
                        checked={
                          filteredFiles.filter((file) => !file.isFolder).length > 0 &&
                          filteredFiles
                            .filter((file) => !file.isFolder)
                            .every((file) => selectedFiles.includes(file.id))
                        }
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Modified
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`${
                        selectedFiles.includes(file.id)
                          ? 'bg-primary-50 dark:bg-primary-900/10'
                          : 'hover:bg-gray-50 dark:hover:bg-secondary-700'
                      }`}
                      onClick={() => {
                        if (file.isFolder) {
                          handleFolderClick(file.id);
                        } else {
                          toggleFileSelection(file.id, !selectedFiles.includes(file.id));
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!file.isFolder && (
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={selectedFiles.includes(file.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(file.id, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {file.isFolder ? (
                            <FolderIcon className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <DocumentIcon className="h-5 w-5 text-blue-500" />
                          )}
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {file.name}
                          </span>
                          {file.isFolder && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              (folder)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(file.modifiedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {file.isFolder ? '—' : formatFileSize(file.size)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedFiles.length} file(s) selected
            </div>
            <div className="space-x-2">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={selectedFiles.length === 0}
                onClick={handleImportFiles}
                leftIcon={<CheckIcon className="h-4 w-4" />}
              >
                Import Files
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
