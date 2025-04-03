import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFiles } from '@/hooks/useFiles';
import { DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FileContextSelectorProps {
  selectedFileIds: string[];
  onSelectFiles: (fileIds: string[]) => void;
  onClose: () => void;
}

export const FileContextSelector: React.FC<FileContextSelectorProps> = ({
  selectedFileIds,
  onSelectFiles,
  onClose,
}) => {
  const { files } = useFiles();
  const [localSelectedFileIds, setLocalSelectedFileIds] = useState<string[]>(selectedFileIds);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFileSelection = (fileId: string) => {
    if (localSelectedFileIds.includes(fileId)) {
      setLocalSelectedFileIds(localSelectedFileIds.filter((id) => id !== fileId));
    } else {
      setLocalSelectedFileIds([...localSelectedFileIds, fileId]);
    }
  };

  const handleSave = () => {
    onSelectFiles(localSelectedFileIds);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter files based on search query and indexed status
  const filteredFiles = files
    .filter((file) => file.status === 'indexed')
    .filter((file) =>
      searchQuery
        ? file.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Select Files for Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            <div className="overflow-y-auto max-h-80">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No indexed files found. Upload and index files first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center p-3 rounded-lg ${
                        localSelectedFileIds.includes(file.id)
                          ? 'bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800'
                          : 'bg-white dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } cursor-pointer`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <div
                        className={`flex-shrink-0 h-6 w-6 rounded-full mr-3 flex items-center justify-center ${
                          localSelectedFileIds.includes(file.id)
                            ? 'bg-primary-500 text-white'
                            : 'bg-white dark:bg-secondary-700 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {localSelectedFileIds.includes(file.id) && <CheckIcon className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.name}
                          </p>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save ({localSelectedFileIds.length} files)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
