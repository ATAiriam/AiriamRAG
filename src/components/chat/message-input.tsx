import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = 'Type a message...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '40px'; // Reset height to calculate properly
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  // Handle enter key to send message (with shift for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="block w-full resize-none bg-transparent border-0 py-3 pl-4 pr-12 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        style={{ minHeight: '40px', maxHeight: '200px' }}
        disabled={isLoading}
      />
      <Button
        className="absolute bottom-1.5 right-2"
        size="sm"
        variant="primary"
        onClick={onSend}
        disabled={!value.trim() || isLoading}
        isLoading={isLoading}
      >
        {!isLoading && <PaperAirplaneIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
};
