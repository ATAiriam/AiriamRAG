import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChatBubbleLeftRightIcon, 
  TrashIcon, 
  EllipsisHorizontalIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';
import { Conversation } from '@/redux/slices/chatSlice';
import { Menu, Transition } from '@headlessui/react';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If the conversation is from today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the conversation is from this week, show day of week
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }
    
    // Otherwise show the date
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectConversation(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {conversation.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conversation.messages.length > 0
                    ? conversation.messages[conversation.messages.length - 1].content.substring(0, 50) +
                      (conversation.messages[conversation.messages.length - 1].content.length > 50 ? '...' : '')
                    : 'No messages yet'}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                  <span>{conversation.messages.length} messages</span>
                  
                  {conversation.fileContext && conversation.fileContext.length > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <DocumentTextIcon className="h-3 w-3 mr-1" />
                      <span>{conversation.fileContext.length} files</span>
                    </>
                  )}

                  <span className="ml-auto">
                    {formatDate(conversation.updatedAt)}
                  </span>
                </div>
              </div>
              
              <Menu as="div" className="relative ml-2">
                <Menu.Button
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
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
                  <Menu.Items
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-secondary-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300'
                            } flex w-full items-center px-4 py-2 text-sm`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  'Are you sure you want to delete this conversation?'
                                )
                              ) {
                                onDeleteConversation(conversation.id);
                              }
                            }}
                          >
                            <TrashIcon className="mr-3 h-5 w-5 text-gray-400" />
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
