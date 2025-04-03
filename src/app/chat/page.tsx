'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConversationList } from '@/components/chat/conversation-list';
import { EmptyState } from '@/components/ui/empty-state';
import { useChat } from '@/hooks/useChat';
import { CreateConversationModal } from '@/components/chat/create-conversation-modal';

export default function ChatPage() {
  const router = useRouter();
  const { conversations, isLoading, error, deleteConversation } = useChat();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateConversation = (id: string) => {
    setShowCreateModal(false);
    router.push(`/chat/${id}`);
  };

  const handleSelectConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Chat</h1>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          New Conversation
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-700 dark:text-gray-300">Loading conversations...</span>
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />}
          title="No conversations yet"
          description="Start a new conversation to chat with your AI assistant."
          action={{
            label: 'New Conversation',
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ConversationList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={deleteConversation}
          />
        </div>
      )}

      {showCreateModal && (
        <CreateConversationModal
          onClose={() => setShowCreateModal(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}
    </div>
  );
}
