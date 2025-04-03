import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fileReducer from './slices/fileSlice';
import chatReducer from './slices/chatSlice';
import dashboardReducer from './slices/dashboardSlice';
import tenantReducer from './slices/tenantSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    chat: chatReducer,
    dashboard: dashboardReducer,
    tenant: tenantReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['file/uploadFiles/pending'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.file'],
        // Ignore these paths in the state
        ignoredPaths: ['file.uploadedFiles'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
