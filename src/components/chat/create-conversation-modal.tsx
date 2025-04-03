import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useChat } from '@/hooks/useChat';
import { useFiles } from '@/hooks/useFiles';
import { DocumentTextIcon, FolderIcon, CheckIcon } from '@heroicons/react/24/outline';
import { File } from '@/redux/slices/fileSlice';

interface CreateConversationModalProps {
  onClose: () => void;
  onCreateConversation: (id: string) => void;
}

export const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  onClose,
  onCreateConversation,
}) => {
  const [title, setTitle] = useState('New Conversation');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const { createConversation } = useChat();
  const { files } = useFiles();

  const handleCreateConversation = async () => {
    if (!title.trim()) {
      setError('Please enter a title for the conversation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const conversation = await createConversation(
        title,
        selectedFileIds.length > 0 ? selectedFileIds : undefined
      );
      onCreateConversation(conversation.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    if (selectedFileIds.includes(fileId)) {
      setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
    } else {
      setSelectedFileIds([...selectedFileIds, fileId]);
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFileList = () => {
    const indexedFiles = files.filter((file) => file.status === 'indexed');

    if (indexedFiles.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No indexed files found. Upload and index files first.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto max-h-80">
        <div className="space-y-2">
          {indexedFiles.map((file) => (
            <div
              key={file.id}
              className={`flex items-center p-3 rounded-lg ${
                selectedFileIds.includes(file.id)
                  ? 'bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800'
                  : 'bg-white dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              } cursor-pointer`}
              onClick={() => toggleFileSelection(file.id)}
            >
              <div
                className={`flex-shrink-0 h-6 w-6 rounded-full mr-3 flex items-center justify-center ${
                  selectedFileIds.includes(file.id)
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-secondary-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {selectedFileIds.includes(file.id) && <CheckIcon className="h-4 w-4" />}
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
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>{showFileSelector ? 'Select Files' : 'Create New Conversation'}</CardTitle>
          </CardHeader>
          <CardContent>
            {!showFileSelector ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="conversation-title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Conversation Title
                  </label>
                  <Input
                    id="conversation-title"
                    placeholder="Enter a title for your conversation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Context Files
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFileSelector(true)}
                    >
                      Select Files
                    </Button>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-secondary-900 p-3 min-h-20">
                    {selectedFileIds.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No files selected. You can select files to provide context for the conversation.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedFileIds.map((fileId) => {
                          const file = files.find((f) => f.id === fileId);
                          return (
                            <div
                              key={fileId}
                              className="flex items-center px-3 py-1 bg-white dark:bg-secondary-800 rounded-full border border-gray-200 dark:border-gray-700 text-sm"
                            >
                              <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="truncate max-w-[150px]">{file?.name}</span>
                              <button
                                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
                                }}
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              renderFileList()
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {showFileSelector ? (
              <>
                <Button variant="secondary" onClick={() => setShowFileSelector(false)}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setShowFileSelector(false)}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  isLoading={isLoading}
                  onClick={handleCreateConversation}
                >
                  Create
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
