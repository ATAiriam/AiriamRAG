import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { User } from './authSlice';

// Types
interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'contributor' | 'reviewer' | 'viewer';
  tenantId: string;
}

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'contributor' | 'reviewer' | 'viewer';
  isActive?: boolean;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string; state: RootState }
>('user/fetchUsers', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string; state: RootState }
>('user/fetchUser', async (userId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<User>(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

export const createUser = createAsyncThunk<
  User,
  CreateUserRequest,
  { rejectValue: string; state: RootState }
>('user/createUser', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post<User>(`${process.env.NEXT_PUBLIC_API_URL}/users`, request, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create user');
  }
});

export const updateUser = createAsyncThunk<
  User,
  UpdateUserRequest,
  { rejectValue: string; state: RootState }
>('user/updateUser', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put<User>(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${request.id}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('user/deleteUser', async (userId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return userId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

// Initial state
const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch users';
    });

    // Fetch user
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch user';
    });

    // Create user
    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = [...state.users, action.payload];
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create user';
    });

    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update in users list
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      
      // Update selected user if it's the updated one
      if (state.selectedUser && state.selectedUser.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update user';
    });

    // Delete user
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      
      // Clear selected user if it's the deleted one
      if (state.selectedUser && state.selectedUser.id === action.payload) {
        state.selectedUser = null;
      }
    });
  },
});

export const { clearSelectedUser, clearError } = userSlice.actions;

export default userSlice.reducer;
