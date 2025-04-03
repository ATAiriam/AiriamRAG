import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Types
export interface ThemeSettings {
  primaryColor: string;
  logoUrl?: string;
  favicon?: string;
  darkMode: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  theme: ThemeSettings;
  maxUsers?: number;
  maxFiles?: number;
  maxQueries?: number;
}

interface CreateTenantRequest {
  name: string;
  domain?: string;
  theme?: Partial<ThemeSettings>;
  maxUsers?: number;
  maxFiles?: number;
  maxQueries?: number;
}

interface UpdateTenantRequest {
  id: string;
  name?: string;
  domain?: string;
  isActive?: boolean;
  theme?: Partial<ThemeSettings>;
  maxUsers?: number;
  maxFiles?: number;
  maxQueries?: number;
}

interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchTenants = createAsyncThunk<
  Tenant[],
  void,
  { rejectValue: string; state: RootState }
>('tenant/fetchTenants', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<Tenant[]>(`${process.env.NEXT_PUBLIC_API_URL}/tenants`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenants');
  }
});

export const fetchTenant = createAsyncThunk<
  Tenant,
  string,
  { rejectValue: string; state: RootState }
>('tenant/fetchTenant', async (tenantId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<Tenant>(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenant');
  }
});

export const createTenant = createAsyncThunk<
  Tenant,
  CreateTenantRequest,
  { rejectValue: string; state: RootState }
>('tenant/createTenant', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post<Tenant>(`${process.env.NEXT_PUBLIC_API_URL}/tenants`, request, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create tenant');
  }
});

export const updateTenant = createAsyncThunk<
  Tenant,
  UpdateTenantRequest,
  { rejectValue: string; state: RootState }
>('tenant/updateTenant', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put<Tenant>(
      `${process.env.NEXT_PUBLIC_API_URL}/tenants/${request.id}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update tenant');
  }
});

export const deleteTenant = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('tenant/deleteTenant', async (tenantId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return tenantId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete tenant');
  }
});

export const updateTenantTheme = createAsyncThunk<
  Tenant,
  { tenantId: string; theme: Partial<ThemeSettings> },
  { rejectValue: string; state: RootState }
>('tenant/updateTenantTheme', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put<Tenant>(
      `${process.env.NEXT_PUBLIC_API_URL}/tenants/${request.tenantId}/theme`,
      { theme: request.theme },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update tenant theme');
  }
});

// Initial state
const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
  isLoading: false,
  error: null,
};

// Slice
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tenants
    builder.addCase(fetchTenants.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTenants.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tenants = action.payload;
    });
    builder.addCase(fetchTenants.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch tenants';
    });

    // Fetch tenant
    builder.addCase(fetchTenant.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTenant.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentTenant = action.payload;
    });
    builder.addCase(fetchTenant.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch tenant';
    });

    // Create tenant
    builder.addCase(createTenant.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTenant.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tenants = [...state.tenants, action.payload];
    });
    builder.addCase(createTenant.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create tenant';
    });

    // Update tenant
    builder.addCase(updateTenant.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTenant.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update in tenants list
      const index = state.tenants.findIndex((tenant) => tenant.id === action.payload.id);
      if (index !== -1) {
        state.tenants[index] = action.payload;
      }
      
      // Update current tenant if it's the updated one
      if (state.currentTenant && state.currentTenant.id === action.payload.id) {
        state.currentTenant = action.payload;
      }
    });
    builder.addCase(updateTenant.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update tenant';
    });

    // Delete tenant
    builder.addCase(deleteTenant.fulfilled, (state, action) => {
      state.tenants = state.tenants.filter((tenant) => tenant.id !== action.payload);
      
      // Clear current tenant if it's the deleted one
      if (state.currentTenant && state.currentTenant.id === action.payload) {
        state.currentTenant = null;
      }
    });

    // Update tenant theme
    builder.addCase(updateTenantTheme.fulfilled, (state, action) => {
      // Update in tenants list
      const index = state.tenants.findIndex((tenant) => tenant.id === action.payload.id);
      if (index !== -1) {
        state.tenants[index] = action.payload;
      }
      
      // Update current tenant if it's the updated one
      if (state.currentTenant && state.currentTenant.id === action.payload.id) {
        state.currentTenant = action.payload;
      }
    });
  },
});

export const { setCurrentTenant, clearError } = tenantSlice.actions;

export default tenantSlice.reducer;
