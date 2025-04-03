'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { useFiles } from '@/hooks/useFiles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/chat/chat-message';
import { MessageInput } from '@/components/chat/message-input';
import { FileContextSelector } from '@/components/chat/file-context-selector';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  
  const { 
    currentConversation, 
    isLoading, 
    isMessageLoading, 
    error, 
    sendMessage, 
    deleteConversation,
    updateConversationContext 
  } = useChat({ conversationId });
  
  const { files } = useFiles();
  
  const [message, setMessage] = useState('');
  const [showContextSelector, setShowContextSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversation) return;
    
    try {
      await sendMessage(message, currentConversation.id, currentConversation.fileContext);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectFiles = (fileIds: string[]) => {
    if (!currentConversation) return;
    
    updateConversationContext(currentConversation.id, fileIds);
    setShowContextSelector(false);
  };

  const handleGoBack = () => {
    router.push('/chat');
  };

  const handleDeleteConversation = async () => {
    if (!currentConversation) return;
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(currentConversation.id);
        router.push('/chat');
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading conversation...</span>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <InformationCircleIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Conversation not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The conversation you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="primary" onClick={handleGoBack}>
            Back to Conversations
          </Button>
        </div>
      </div>
    );
  }

  const selectedContextFiles = files.filter(
    (file) => currentConversation.fileContext?.includes(file.id)
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            onClick={handleGoBack}
          >
            Back
          </Button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {currentConversation.title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {currentConversation.fileContext && currentConversation.fileContext.length > 0 && (
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-1" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentConversation.fileContext.length} file
                {currentConversation.fileContext.length !== 1 ? 's' : ''} in context
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContextSelector(true)}
          >
            {currentConversation.fileContext && currentConversation.fileContext.length > 0
              ? 'Change Files'
              : 'Add Files'}
          </Button>
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-secondary-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        } flex w-full items-center px-4 py-2 text-sm`}
                        onClick={handleDeleteConversation}
                      >
                        Delete conversation
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {selectedContextFiles.length > 0 && (
        <div className="mb-4 flex items-center bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-md p-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">Context files:</span>{' '}
            {selectedContextFiles.map((file) => file.name).join(', ')}
          </div>
        </div>
      )}

      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="h-[calc(100vh-320px)] overflow-y-auto p-4 space-y-6">
            {currentConversation.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20">
                  <svg
                    className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-gray-100">
                  Start a new conversation
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  This is the beginning of your conversation. Ask a question to get started.
                </p>
              </div>
            ) : (
              currentConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  files={files}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      <MessageInput
        value={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        isLoading={isMessageLoading}
        placeholder="Type your message..."
      />

      {showContextSelector && (
        <FileContextSelector
          selectedFileIds={currentConversation.fileContext || []}
          onSelectFiles={handleSelectFiles}
          onClose={() => setShowContextSelector(false)}
        />
      )}
    </>
  );
}
