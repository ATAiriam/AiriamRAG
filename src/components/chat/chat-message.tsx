import React, { useState } from 'react';
import { Message } from '@/redux/slices/chatSlice';
import { File } from '@/redux/slices/fileSlice';
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ChatMessageProps {
  message: Message;
  files: File[];
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, files }) => {
  const [showSources, setShowSources] = useState(true);

  const isUserMessage = message.role === 'user';
  const hasSources = message.sources && message.sources.length > 0;

  // Get file names for sources
  const getFileName = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    return file ? file.name : 'Unknown file';
  };

  return (
    <div
      className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative max-w-[80%] rounded-lg px-4 py-3 ${
          isUserMessage
            ? 'bg-primary-600 text-white'
            : 'bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        {!isUserMessage && (
          <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.632 2.163l1.313.397c.65.198 1.117.77 1.117 1.442v1.3m-3.6-3.3l-1.5.5M4.5 6.3v9.75a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75m-23.25 0v-.375c0-1.052.8-1.875 1.875-1.875H8.25c.429 0 .843.15 1.171.429L12 7.5l3.433-2.576c.398-.3.792-.429 1.192-.429h3.75c1.052 0 1.875.84 1.875 1.875V6.75m-23.25 0v10.125c0 1.052.84 1.875 1.875 1.875H22.5c1.052 0 1.875-.84 1.875-1.875V6.75M4.5 6.75h21M4.5 13.5h21"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none">
          {message.content.split('\n').map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'mt-0' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {hasSources && (
          <div className="mt-2">
            <div
              className="flex items-center text-xs cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowSources(!showSources)}
            >
              {showSources ? (
                <ChevronUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 mr-1" />
              )}
              <span>{showSources ? 'Hide sources' : 'Show sources'}</span>
            </div>

            {showSources && (
              <div className="mt-2 space-y-2">
                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          {getFileName(source.fileId)}
                          {source.page && <span> (Page {source.page})</span>}
                        </div>
                        <div className="mt-1 text-gray-600 dark:text-gray-300">
                          "{source.snippet}"
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
