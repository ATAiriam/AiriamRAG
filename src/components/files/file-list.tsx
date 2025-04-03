import React from 'react';
import { File, FileTag, FileCategory } from '@/redux/slices/fileSlice';
import {
  DocumentTextIcon,
  DocumentIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  TrashIcon,
  EyeIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileListProps {
  files: File[];
  selectedFiles: string[];
  onSelectFiles: (fileIds: string[]) => void;
  onViewFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  isLoading?: boolean;
  view: 'grid' | 'list';
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFiles,
  onSelectFiles,
  onViewFile,
  onDeleteFile,
  isLoading = false,
  view,
}) => {
  const handleSelectFile = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      onSelectFiles([...selectedFiles, fileId]);
    } else {
      onSelectFiles(selectedFiles.filter((id) => id !== fileId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      onSelectFiles(files.map((file) => file.id));
    } else {
      onSelectFiles([]);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
    }
    if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('csv')) {
      return <TableCellsIcon className="h-8 w-8 text-green-500" />;
    }
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return <PresentationChartBarIcon className="h-8 w-8 text-orange-500" />;
    }
    return <DocumentIcon className="h-8 w-8 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    indexed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading files...</span>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <DocumentIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No files found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload files to start analyzing your documents.
        </p>
      </div>
    );
  }

  return (
    <>
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card
              key={file.id}
              className={`transition-shadow duration-200 ${
                selectedFiles.includes(file.id)
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                  : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(file.type)}
                        <div className="ml-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                            {file.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(file.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            statusColors[file.status]
                          }`}
                        >
                          {file.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {file.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {file.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{file.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<EyeIcon className="h-4 w-4" />}
                          onClick={() => onViewFile(file.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<TagIcon className="h-4 w-4" />}
                          onClick={() => onViewFile(file.id)}
                        >
                          Tags
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<TrashIcon className="h-4 w-4" />}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this file?')) {
                              onDeleteFile(file.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-secondary-900">
              <tr>
                <th scope="col" className="relative px-6 py-3">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={selectedFiles.length === files.length && files.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
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
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Tags
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-gray-700">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className={`${
                    selectedFiles.includes(file.id)
                      ? 'bg-primary-50 dark:bg-primary-900/10'
                      : 'hover:bg-gray-50 dark:hover:bg-secondary-700'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {file.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {file.isExternal ? (
                            <span className="flex items-center">
                              <span>External</span>
                              <svg
                                className="ml-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </span>
                          ) : (
                            'Uploaded'
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{file.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          +{file.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(file.uploadDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[file.status]
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => onViewFile(file.id)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this file?')) {
                            onDeleteFile(file.id);
                          }
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
