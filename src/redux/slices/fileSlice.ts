import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Types
export interface FileTag {
  id: string;
  name: string;
  color?: string;
  confidence?: number;
  approved?: boolean;
  createdBy?: string;
  approvedBy?: string;
}

export interface FileCategory {
  id: string;
  name: string;
  color?: string;
}

export interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  lastModified: string;
  source: 'upload' | 'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint';
  isExternal: boolean;
  externalId?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  tags: FileTag[];
  categories: FileCategory[];
  createdBy: string;
  status: 'processing' | 'indexed' | 'error';
  errorMessage?: string;
}

export interface FileUploadRequest {
  files: FileList | File[];
  storeFullContent?: boolean;
  suggestTags?: boolean;
}

export interface CloudFileRequest {
  provider: 'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint';
  files: string[];
  storeFullContent?: boolean;
  suggestTags?: boolean;
}

interface FilesState {
  files: File[];
  selectedFiles: string[];
  uploadedFiles: FileList | File[] | null;
  currentFile: File | null;
  availableTags: FileTag[];
  availableCategories: FileCategory[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

// Async thunks
export const fetchFiles = createAsyncThunk<
  File[],
  void,
  { rejectValue: string; state: RootState }
>('file/fetchFiles', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<File[]>(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch files');
  }
});

export const fetchFile = createAsyncThunk<
  File,
  string,
  { rejectValue: string; state: RootState }
>('file/fetchFile', async (fileId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<File>(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch file');
  }
});

export const uploadFiles = createAsyncThunk<
  File[],
  FileUploadRequest,
  { rejectValue: string; state: RootState }
>('file/uploadFiles', async (request, { rejectWithValue, getState, dispatch }) => {
  try {
    const { auth } = getState();
    const formData = new FormData();
    
    Array.from(request.files).forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('storeFullContent', String(request.storeFullContent || false));
    formData.append('suggestTags', String(request.suggestTags || true));
    
    const response = await axios.post<File[]>(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        dispatch(setUploadProgress(percentCompleted));
      },
    });
    
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to upload files');
  }
});

export const addCloudFiles = createAsyncThunk<
  File[],
  CloudFileRequest,
  { rejectValue: string; state: RootState }
>('file/addCloudFiles', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post<File[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/files/cloud`,
      request,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add cloud files');
  }
});

export const updateFileTags = createAsyncThunk<
  File,
  { fileId: string; tags: FileTag[] },
  { rejectValue: string; state: RootState }
>('file/updateFileTags', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put<File>(
      `${process.env.NEXT_PUBLIC_API_URL}/files/${request.fileId}/tags`,
      { tags: request.tags },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update file tags');
  }
});

export const updateFileCategories = createAsyncThunk<
  File,
  { fileId: string; categories: FileCategory[] },
  { rejectValue: string; state: RootState }
>('file/updateFileCategories', async (request, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put<File>(
      `${process.env.NEXT_PUBLIC_API_URL}/files/${request.fileId}/categories`,
      { categories: request.categories },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update file categories');
  }
});

export const deleteFile = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('file/deleteFile', async (fileId, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return fileId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete file');
  }
});

export const fetchAvailableTags = createAsyncThunk<
  FileTag[],
  void,
  { rejectValue: string; state: RootState }
>('file/fetchAvailableTags', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<FileTag[]>(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch available tags');
  }
});

export const fetchAvailableCategories = createAsyncThunk<
  FileCategory[],
  void,
  { rejectValue: string; state: RootState }
>('file/fetchAvailableCategories', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get<FileCategory[]>(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch available categories');
  }
});

// Initial state
const initialState: FilesState = {
  files: [],
  selectedFiles: [],
  uploadedFiles: null,
  currentFile: null,
  availableTags: [],
  availableCategories: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,
};

// Slice
const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setSelectedFiles: (state, action: PayloadAction<string[]>) => {
      state.selectedFiles = action.payload;
    },
    setUploadedFiles: (state, action: PayloadAction<FileList | File[]>) => {
      state.uploadedFiles = action.payload;
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = null;
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch files
    builder.addCase(fetchFiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.files = action.payload;
    });
    builder.addCase(fetchFiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch files';
    });

    // Fetch file
    builder.addCase(fetchFile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentFile = action.payload;
    });
    builder.addCase(fetchFile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch file';
    });

    // Upload files
    builder.addCase(uploadFiles.pending, (state) => {
      state.isUploading = true;
      state.error = null;
    });
    builder.addCase(uploadFiles.fulfilled, (state, action) => {
      state.isUploading = false;
      state.files = [...state.files, ...action.payload];
      state.uploadProgress = 100;
    });
    builder.addCase(uploadFiles.rejected, (state, action) => {
      state.isUploading = false;
      state.error = action.payload || 'Failed to upload files';
    });

    // Add cloud files
    builder.addCase(addCloudFiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addCloudFiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.files = [...state.files, ...action.payload];
    });
    builder.addCase(addCloudFiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to add cloud files';
    });

    // Update file tags
    builder.addCase(updateFileTags.fulfilled, (state, action) => {
      const index = state.files.findIndex((file) => file.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = action.payload;
      }
      if (state.currentFile?.id === action.payload.id) {
        state.currentFile = action.payload;
      }
    });

    // Update file categories
    builder.addCase(updateFileCategories.fulfilled, (state, action) => {
      const index = state.files.findIndex((file) => file.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = action.payload;
      }
      if (state.currentFile?.id === action.payload.id) {
        state.currentFile = action.payload;
      }
    });

    // Delete file
    builder.addCase(deleteFile.fulfilled, (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
      if (state.currentFile?.id === action.payload) {
        state.currentFile = null;
      }
      state.selectedFiles = state.selectedFiles.filter((id) => id !== action.payload);
    });

    // Fetch available tags
    builder.addCase(fetchAvailableTags.fulfilled, (state, action) => {
      state.availableTags = action.payload;
    });

    // Fetch available categories
    builder.addCase(fetchAvailableCategories.fulfilled, (state, action) => {
      state.availableCategories = action.payload;
    });
  },
});

export const {
  setSelectedFiles,
  setUploadedFiles,
  clearUploadedFiles,
  setUploadProgress,
  clearError,
} = fileSlice.actions;

export default fileSlice.reducer;
