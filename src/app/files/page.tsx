'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFiles } from '@/hooks/useFiles';
import { PlusIcon, FolderIcon, TrashIcon, TagIcon, DocumentTextIcon, CloudArrowUpIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/files/file-uploader';
import { FileList } from '@/components/files/file-list';
import { CloudConnector } from '@/components/files/cloud-connector';
import { FileTag, FileCategory } from '@/redux/slices/fileSlice';

type UploadMode = 'upload' | 'cloud';
type FileView = 'grid' | 'list';

export default function FilesPage() {
  const router = useRouter();
  const {
    files,
    selectedFiles,
    isLoading,
    isUploading,
    error,
    uploadFiles,
    addCloudFiles,
    deleteFile,
    selectFiles,
  } = useFiles();

  const [uploadMode, setUploadMode] = useState<UploadMode>('upload');
  const [fileView, setFileView] = useState<FileView>('grid');
  const [showUploader, setShowUploader] = useState(false);
  const [provider, setProvider] = useState<'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint' | null>(null);
  const [storeFullContent, setStoreFullContent] = useState(false);
  const [suggestTags, setSuggestTags] = useState(true);

  const handleFileUpload = async (files: FileList | File[]) => {
    try {
      await uploadFiles(files, { storeFullContent, suggestTags });
      setShowUploader(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleCloudFileAdd = async (provider: 'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint', fileIds: string[]) => {
    try {
      await addCloudFiles(provider, fileIds, { storeFullContent, suggestTags });
      setProvider(null);
    } catch (error) {
      console.error('Error adding cloud files:', error);
    }
  };

  const handleDeleteSelectedFiles = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      try {
        for (const fileId of selectedFiles) {
          await deleteFile(fileId);
        }
        selectFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
      }
    }
  };

  const handleViewFile = (fileId: string) => {
    router.push(`/files/${fileId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">File Analysis</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setShowUploader(true)}
          >
            Add Files
          </Button>
          {selectedFiles.length > 0 && (
            <Button
              variant="danger"
              leftIcon={<TrashIcon className="h-4 w-4" />}
              onClick={handleDeleteSelectedFiles}
            >
              Delete {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Files</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowUploader(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="flex mb-4">
                <button
                  className={`flex-1 py-2 border-b-2 ${
                    uploadMode === 'upload'
                      ? 'border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setUploadMode('upload')}
                >
                  <div className="flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Upload Files
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 border-b-2 ${
                    uploadMode === 'cloud'
                      ? 'border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setUploadMode('cloud')}
                >
                  <div className="flex items-center justify-center">
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    Connect Cloud
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                {uploadMode === 'upload' ? (
                  <FileUploader onUpload={handleFileUpload} isUploading={isUploading} />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card
                        clickable
                        className={`${provider === 'google-drive' ? 'ring-2 ring-primary-500' : ''}`}
                        onClick={() => setProvider('google-drive')}
                      >
                        <CardContent className="p-4 flex items-center justify-center space-x-2">
                          <svg className="h-6 w-6 text-[#4285F4]" viewBox="0 0 87.3 78" fill="currentColor">
                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3.3.2.6.35.95.5L33.65 52 6.6 66.85Z" fill="#0066DA"/>
                            <path d="m43.65 25-10-17.4-10 17.4 10 17.4 17.4-10.15c-.05-.4-.05-.85-.05-1.25s0-.85.05-1.25L43.65 25Z" fill="#00AC47"/>
                            <path d="M73.55 76.8c1.4-.8 2.5-1.95 3.3-3.3l3.85-6.65L54.35 52.5 43.6 77h.05c.35-.15.65-.3.95-.5l28.95-19.7Z" fill="#EA4335"/>
                            <path d="M43.65 25 26.25 14.85a8.54 8.54 0 0 0-.95.5 9.16 9.16 0 0 0-3.3 3.3L6.6 45.2c-.8 1.4-1.25 3-1.25 4.65s.45 3.2 1.25 4.65L33.7 40 43.65 25Z" fill="#00832D"/>
                            <path d="m80.7 45.2-15.4-26.55a9.13 9.13 0 0 0-3.3-3.3c-.3-.2-.6-.35-.95-.5L43.65 25 54.35 41.5l27.1 14.5c.8-1.45 1.25-3.05 1.25-4.65s-.45-3.25-1.25-4.65l-.75-1.5Z" fill="#2684FC"/>
                            <path d="M43.65 25 61.05 14.85c-.3-.15-.6-.3-.95-.5-1.7-.95-3.7-1.5-5.75-1.5s-4.05.55-5.75 1.5c-.3.2-.65.35-.95.5l-10 17.4 6 10.35L43.65 25Z" fill="#FFBA00"/>
                          </svg>
                          <span className="font-medium">Google Drive</span>
                        </CardContent>
                      </Card>
                      <Card
                        clickable
                        className={`${provider === 'onedrive' ? 'ring-2 ring-primary-500' : ''}`}
                        onClick={() => setProvider('onedrive')}
                      >
                        <CardContent className="p-4 flex items-center justify-center space-x-2">
                          <svg className="h-6 w-6 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.5 14.669c1.72.31 3.352.154 4.624-.47 1.4-.69 2.23-1.92 2.23-3.33 0-3.12-3.26-4.81-6.43-4.81-2.19 0-4.11 1.96-5.07 3.29-.4.55-1.39 1.9-1A80.366 80.366 0 0 0 4.878 6c-.057 0-.11.005-.164.011C2.23 6.147.672 7.88.672 9.932c0 1.97 1.29 3.6 3.1 4.28.335.118 1.585.457 4.888.457h1.84z" />
                            <path d="M20.229 14.009c1.695 0 3.1-1.41 3.1-3.11 0-1.38-.92-2.58-2.2-2.97-.31-1.29-1.27-2.38-2.65-2.82-.27-.08-.54-.13-.81-.13-1.18 0-2.27.63-2.87 1.63-.4-.27-.88-.4-1.37-.4-.73 0-1.4.31-1.87.82L11.24 9c1.1-.03 2.23.13 3.32.5s2.08 1.04 2.74 1.9c-.002.056-.005.105-.005.153 0 .96.55 1.84 1.42 2.27.473.218.998.186 1.51.186z" />
                          </svg>
                          <span className="font-medium">OneDrive</span>
                        </CardContent>
                      </Card>
                      <Card
                        clickable
                        className={`${provider === 'dropbox' ? 'ring-2 ring-primary-500' : ''}`}
                        onClick={() => setProvider('dropbox')}
                      >
                        <CardContent className="p-4 flex items-center justify-center space-x-2">
                          <svg className="h-6 w-6 text-[#0061FF]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="m12 14.56 4.24-2.68L24 15.56l-7.76 4.48L12 17.24l-4.24 2.8L0 15.56l7.76-3.68L12 14.56zM7.76 4.96 12 7.76l4.24-2.8L24 8.96l-7.76 4.48L12 10.64l-4.24 2.8L0 8.96l7.76-4z" />
                          </svg>
                          <span className="font-medium">Dropbox</span>
                        </CardContent>
                      </Card>
                      <Card
                        clickable
                        className={`${provider === 'sharepoint' ? 'ring-2 ring-primary-500' : ''}`}
                        onClick={() => setProvider('sharepoint')}
                      >
                        <CardContent className="p-4 flex items-center justify-center space-x-2">
                          <svg className="h-6 w-6 text-[#038387]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.99 0C6.137 0 3 3.137 3 6.99v.02C1.167 7.66 0 9.67 0 12c0 3.314 2.686 6 6 6h14c2.21 0 4-1.79 4-4 0-1.826-1.244-3.36-2.934-3.82.147-.563.214-1.155.205-1.75C21.272 3.825 17.217-.074 13-.074L9.99 0zM12 7h6v4h-2v6h-3v-6H8v6H5v-6H3V7h4V3h1l4 4z" />
                          </svg>
                          <span className="font-medium">SharePoint</span>
                        </CardContent>
                      </Card>
                    </div>

                    {provider && (
                      <CloudConnector
                        provider={provider}
                        onSelectFiles={handleCloudFileAdd}
                        onCancel={() => setProvider(null)}
                      />
                    )}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="store-full-content"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={storeFullContent}
                      onChange={(e) => setStoreFullContent(e.target.checked)}
                    />
                    <label htmlFor="store-full-content" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                      Store full content in vector DB (faster, but consumes more storage)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="suggest-tags"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={suggestTags}
                      onChange={(e) => setSuggestTags(e.target.checked)}
                    />
                    <label htmlFor="suggest-tags" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                      Suggest tags using AI
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-secondary-900 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" onClick={() => setShowUploader(false)}>
                Cancel
              </Button>
              {uploadMode === 'upload' ? (
                <Button
                  variant="primary"
                  isLoading={isUploading}
                  disabled={!uploadMode}
                >
                  Upload
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={!provider}
                  onClick={() => {
                    if (provider) {
                      // This would normally open the cloud provider selector
                      // but we're handling this in the CloudConnector component
                    }
                  }}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Selector */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-1 bg-white dark:bg-secondary-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            className={`p-2 rounded-l-md ${
              fileView === 'grid'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFileView('grid')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            className={`p-2 rounded-r-md ${
              fileView === 'list'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFileView('list')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* File List */}
      <FileList
        files={files}
        selectedFiles={selectedFiles}
        onSelectFiles={selectFiles}
        onViewFile={handleViewFile}
        onDeleteFile={deleteFile}
        isLoading={isLoading}
        view={fileView}
      />
    </div>
  );
}
