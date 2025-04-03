import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Types
export interface UsageStats {
  totalQueries: number;
  totalFiles: number;
  totalTokensConsumed: number;
  averageResponseTime: number;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'file_upload' | 'file_delete' | 'conversation_create' | 'conversation_message' | 'login' | 'logout';
  details: string;
  timestamp: string;
}

export interface CreditConsumption {
  date: string;
  credits: number;
}

export interface QueryDistribution {
  category: string;
  count: number;
}

export interface TopDocument {
  id: string;
  name: string;
  type: string;
  accessCount: number;
}

interface TimeRange {
  range: 'day' | 'week' | 'month' | 'year';
}

interface DashboardState {
  usageStats: UsageStats | null;
  activityLog: ActivityLogEntry[];
  creditConsumption: CreditConsumption[];
  queryDistribution: QueryDistribution[];
  topDocuments: TopDocument[];
  selectedTimeRange: 'day' | 'week' | 'month' | 'year';
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchUsageStats = createAsyncThunk<
  UsageStats,
  TimeRange,
  { rejectValue: string; state: RootState }
>('dashboard/fetchUsageStats', async (timeRange, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<UsageStats>(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/usage-stats`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          range: timeRange.range,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch usage stats');
  }
});

export const fetchActivityLog = createAsyncThunk<
  ActivityLogEntry[],
  TimeRange,
  { rejectValue: string; state: RootState }
>('dashboard/fetchActivityLog', async (timeRange, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<ActivityLogEntry[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/activity-log`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          range: timeRange.range,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity log');
  }
});

export const fetchCreditConsumption = createAsyncThunk<
  CreditConsumption[],
  TimeRange,
  { rejectValue: string; state: RootState }
>('dashboard/fetchCreditConsumption', async (timeRange, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<CreditConsumption[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/credit-consumption`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          range: timeRange.range,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch credit consumption');
  }
});

export const fetchQueryDistribution = createAsyncThunk<
  QueryDistribution[],
  TimeRange,
  { rejectValue: string; state: RootState }
>('dashboard/fetchQueryDistribution', async (timeRange, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<QueryDistribution[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/query-distribution`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          range: timeRange.range,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch query distribution');
  }
});

export const fetchTopDocuments = createAsyncThunk<
  TopDocument[],
  TimeRange,
  { rejectValue: string; state: RootState }
>('dashboard/fetchTopDocuments', async (timeRange, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<TopDocument[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/top-documents`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          range: timeRange.range,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch top documents');
  }
});

export const fetchAllDashboardData = createAsyncThunk<
  void,
  TimeRange,
  { state: RootState }
>('dashboard/fetchAllDashboardData', async (timeRange, { dispatch }) => {
  await Promise.all([
    dispatch(fetchUsageStats(timeRange)),
    dispatch(fetchActivityLog(timeRange)),
    dispatch(fetchCreditConsumption(timeRange)),
    dispatch(fetchQueryDistribution(timeRange)),
    dispatch(fetchTopDocuments(timeRange)),
  ]);
});

// Initial state
const initialState: DashboardState = {
  usageStats: null,
  activityLog: [],
  creditConsumption: [],
  queryDistribution: [],
  topDocuments: [],
  selectedTimeRange: 'week',
  isLoading: false,
  error: null,
};

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<'day' | 'week' | 'month' | 'year'>) => {
      state.selectedTimeRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch usage stats
    builder.addCase(fetchUsageStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUsageStats.fulfilled, (state, action) => {
      state.usageStats = action.payload;
    });
    builder.addCase(fetchUsageStats.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch usage stats';
    });

    // Fetch activity log
    builder.addCase(fetchActivityLog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchActivityLog.fulfilled, (state, action) => {
      state.activityLog = action.payload;
    });
    builder.addCase(fetchActivityLog.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch activity log';
    });

    // Fetch credit consumption
    builder.addCase(fetchCreditConsumption.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCreditConsumption.fulfilled, (state, action) => {
      state.creditConsumption = action.payload;
    });
    builder.addCase(fetchCreditConsumption.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch credit consumption';
    });

    // Fetch query distribution
    builder.addCase(fetchQueryDistribution.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchQueryDistribution.fulfilled, (state, action) => {
      state.queryDistribution = action.payload;
    });
    builder.addCase(fetchQueryDistribution.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch query distribution';
    });

    // Fetch top documents
    builder.addCase(fetchTopDocuments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTopDocuments.fulfilled, (state, action) => {
      state.topDocuments = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchTopDocuments.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch top documents';
      state.isLoading = false;
    });
  },
});

export const { setTimeRange, clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
