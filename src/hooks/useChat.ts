import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchConversations,
  fetchConversation,
  createConversation,
  sendMessage,
  deleteConversation,
  updateConversationContext,
  addUserMessageToCurrentConversation,
  clearCurrentConversation,
  Conversation,
  Message,
} from '../redux/slices/chatSlice';

export const useChat = (options: { conversationId?: string; loadData?: boolean } = {}) => {
  const { conversationId, loadData = true } = options;
  const dispatch = useAppDispatch();
  const { conversations, currentConversation, isLoading, isMessageLoading, error } = useAppSelector(
    (state) => state.chat
  );
  
  // Load conversations data
  useEffect(() => {
    if (loadData) {
      dispatch(fetchConversations());
    }
  }, [dispatch, loadData]);
  
  // Load specific conversation if conversationId is provided
  useEffect(() => {
    if (conversationId && loadData) {
      dispatch(fetchConversation(conversationId));
    }
  }, [dispatch, conversationId, loadData]);
  
  // Method to create a new conversation
  const handleCreateConversation = async (
    title: string,
    fileContext?: string[]
  ): Promise<Conversation> => {
    try {
      const result = await dispatch(
        createConversation({ title, fileContext })
      ).unwrap();
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create conversation');
    }
  };
  
  // Method to send a message
  const handleSendMessage = async (
    content: string,
    conversationId: string,
    fileContext?: string[]
  ): Promise<Message> => {
    try {
      // Add user message to UI immediately for better UX
      dispatch(addUserMessageToCurrentConversation(content));
      
      // Send message to API
      const result = await dispatch(
        sendMessage({ content, conversationId, fileContext })
      ).unwrap();
      
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to send message');
    }
  };
  
  // Method to delete a conversation
  const handleDeleteConversation = async (conversationId: string): Promise<void> => {
    try {
      await dispatch(deleteConversation(conversationId)).unwrap();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete conversation');
    }
  };
  
  // Method to update conversation context
  const handleUpdateConversationContext = async (
    conversationId: string,
    fileContext: string[]
  ): Promise<Conversation> => {
    try {
      const result = await dispatch(
        updateConversationContext({ conversationId, fileContext })
      ).unwrap();
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update conversation context');
    }
  };
  
  // Method to clear current conversation
  const handleClearCurrentConversation = (): void => {
    dispatch(clearCurrentConversation());
  };
  
  return {
    conversations,
    currentConversation,
    isLoading,
    isMessageLoading,
    error,
    createConversation: handleCreateConversation,
    sendMessage: handleSendMessage,
    deleteConversation: handleDeleteConversation,
    updateConversationContext: handleUpdateConversationContext,
    clearCurrentConversation: handleClearCurrentConversation,
  };
};
