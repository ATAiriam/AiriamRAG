import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Types
interface MessageSource {
  fileId: string;
  fileName: string;
  snippet: string;
  page?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sources?: MessageSource[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  fileContext?: string[]; // Array of file IDs
}

interface SendMessageRequest {
  conversationId: string;
  content: string;
  fileContext?: string[];
}

interface CreateConversationRequest {
  title: string;
  fileContext?: string[];
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isMessageLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchConversations = createAsyncThunk<
  Conversation[],
  void,
  { rejectValue: string; state: RootState }
>('chat/fetchConversations', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<Conversation[]>(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
  }
});

export const fetchConversation = createAsyncThunk<
  Conversation,
  string,
  { rejectValue: string; state: RootState }
>('chat/fetchConversation', async (conversationId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<Conversation>(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
  }
});

export const createConversation = createAsyncThunk<
  Conversation,
  CreateConversationRequest,
  { rejectValue: string; state: RootState }
>('chat/createConversation', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post<Conversation>(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
      request,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
  }
});

export const sendMessage = createAsyncThunk<
  Message,
  SendMessageRequest,
  { rejectValue: string; state: RootState }
>('chat/sendMessage', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post<Message>(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/${request.conversationId}/messages`,
      {
        content: request.content,
        fileContext: request.fileContext,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send message');
  }
});

export const deleteConversation = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('chat/deleteConversation', async (conversationId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return conversationId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete conversation');
  }
});

export const updateConversationContext = createAsyncThunk<
  Conversation,
  { conversationId: string; fileContext: string[] },
  { rejectValue: string; state: RootState }
>('chat/updateConversationContext', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put<Conversation>(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/${request.conversationId}/context`,
      { fileContext: request.fileContext },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update conversation context');
  }
});

// Initial state
const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isMessageLoading: false,
  error: null,
};

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addUserMessageToCurrentConversation: (state, action: PayloadAction<string>) => {
      if (state.currentConversation) {
        const newMessage: Message = {
          id: `temp-${Date.now()}`,
          conversationId: state.currentConversation.id,
          content: action.payload,
          role: 'user',
          timestamp: new Date().toISOString(),
        };
        
        state.currentConversation.messages.push(newMessage);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch conversations';
    });

    // Fetch conversation
    builder.addCase(fetchConversation.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchConversation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentConversation = action.payload;
    });
    builder.addCase(fetchConversation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch conversation';
    });

    // Create conversation
    builder.addCase(createConversation.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createConversation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.conversations = [action.payload, ...state.conversations];
      state.currentConversation = action.payload;
    });
    builder.addCase(createConversation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create conversation';
    });

    // Send message
    builder.addCase(sendMessage.pending, (state) => {
      state.isMessageLoading = true;
      state.error = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.isMessageLoading = false;
      
      // Update current conversation if it exists
      if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
        // Replace temp user message if it exists
        const tempIndex = state.currentConversation.messages.findIndex(
          (m) => m.id.startsWith('temp-')
        );
        
        if (tempIndex !== -1) {
          state.currentConversation.messages.splice(tempIndex, 1);
        }
        
        state.currentConversation.messages.push(action.payload);
      }
      
      // Update conversations list
      const conversationIndex = state.conversations.findIndex(
        (c) => c.id === action.payload.conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].updatedAt = new Date().toISOString();
      }
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.isMessageLoading = false;
      state.error = action.payload || 'Failed to send message';
    });

    // Delete conversation
    builder.addCase(deleteConversation.fulfilled, (state, action) => {
      state.conversations = state.conversations.filter(
        (conversation) => conversation.id !== action.payload
      );
      
      if (state.currentConversation && state.currentConversation.id === action.payload) {
        state.currentConversation = null;
      }
    });

    // Update conversation context
    builder.addCase(updateConversationContext.fulfilled, (state, action) => {
      // Update current conversation if it exists
      if (state.currentConversation && state.currentConversation.id === action.payload.id) {
        state.currentConversation.fileContext = action.payload.fileContext;
      }
      
      // Update conversations list
      const conversationIndex = state.conversations.findIndex(
        (c) => c.id === action.payload.id
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].fileContext = action.payload.fileContext;
      }
    });
  },
});

export const {
  clearCurrentConversation,
  clearError,
  addUserMessageToCurrentConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
