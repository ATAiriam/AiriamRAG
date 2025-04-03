import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchFiles,
  fetchFile,
  uploadFiles,
  addCloudFiles,
  updateFileTags,
  updateFileCategories,
  deleteFile,
  fetchAvailableTags,
  fetchAvailableCategories,
  setSelectedFiles,
  clearUploadedFiles,
  FileTag,
  FileCategory,
  File,
} from '../redux/slices/fileSlice';

export const useFiles = (options: { fileId?: string; loadData?: boolean } = {}) => {
  const { fileId, loadData = true } = options;
  const dispatch = useAppDispatch();
  const {
    files,
    selectedFiles,
    uploadedFiles,
    currentFile,
    availableTags,
    availableCategories,
    isLoading,
    isUploading,
    uploadProgress,
    error,
  } = useAppSelector((state) => state.file);
  
  // Load files data
  useEffect(() => {
    if (loadData) {
      dispatch(fetchFiles());
      dispatch(fetchAvailableTags());
      dispatch(fetchAvailableCategories());
    }
  }, [dispatch, loadData]);
  
  // Load specific file if fileId is provided
  useEffect(() => {
    if (fileId && loadData) {
      dispatch(fetchFile(fileId));
    }
  }, [dispatch, fileId, loadData]);
  
  // Method to upload files
  const handleUploadFiles = async (
    files: FileList | File[],
    options: { storeFullContent?: boolean; suggestTags?: boolean } = {}
  ) => {
    try {
      const result = await dispatch(
        uploadFiles({ files, ...options })
      ).unwrap();
      dispatch(clearUploadedFiles());
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  // Method to add cloud files
  const handleAddCloudFiles = async (
    provider: 'google-drive' | 'onedrive' | 'dropbox' | 'sharepoint',
    fileIds: string[],
    options: { storeFullContent?: boolean; suggestTags?: boolean } = {}
  ) => {
    try {
      const result = await dispatch(
        addCloudFiles({
          provider,
          files: fileIds,
          ...options,
        })
      ).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  // Method to update file tags
  const handleUpdateFileTags = async (fileId: string, tags: FileTag[]) => {
    try {
      const result = await dispatch(updateFileTags({ fileId, tags })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  // Method to update file categories
  const handleUpdateFileCategories = async (fileId: string, categories: FileCategory[]) => {
    try {
      const result = await dispatch(
        updateFileCategories({ fileId, categories })
      ).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  // Method to delete a file
  const handleDeleteFile = async (fileId: string) => {
    try {
      await dispatch(deleteFile(fileId)).unwrap();
    } catch (err) {
      throw err;
    }
  };
  
  // Method to select files
  const handleSelectFiles = (fileIds: string[]) => {
    dispatch(setSelectedFiles(fileIds));
  };
  
  return {
    files,
    selectedFiles,
    uploadedFiles,
    currentFile,
    availableTags,
    availableCategories,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    uploadFiles: handleUploadFiles,
    addCloudFiles: handleAddCloudFiles,
    updateFileTags: handleUpdateFileTags,
    updateFileCategories: handleUpdateFileCategories,
    deleteFile: handleDeleteFile,
    selectFiles: handleSelectFiles,
  };
};
