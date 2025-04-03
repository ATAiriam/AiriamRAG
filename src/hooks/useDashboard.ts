import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchAllDashboardData,
  fetchUsageStats,
  fetchActivityLog,
  fetchCreditConsumption,
  fetchQueryDistribution,
  fetchTopDocuments,
  setTimeRange,
} from '../redux/slices/dashboardSlice';

export const useDashboard = (options: { loadData?: boolean } = {}) => {
  const { loadData = true } = options;
  const dispatch = useAppDispatch();
  const {
    usageStats,
    activityLog,
    creditConsumption,
    queryDistribution,
    topDocuments,
    selectedTimeRange,
    isLoading,
    error,
  } = useAppSelector((state) => state.dashboard);

  // Load dashboard data on component mount
  useEffect(() => {
    if (loadData) {
      dispatch(fetchAllDashboardData({ range: selectedTimeRange }));
    }
  }, [dispatch, loadData, selectedTimeRange]);

  // Method to change time range and reload data
  const handleChangeTimeRange = (range: 'day' | 'week' | 'month' | 'year') => {
    dispatch(setTimeRange(range));
  };

  // Method to refresh usage stats
  const handleRefreshUsageStats = async () => {
    try {
      await dispatch(fetchUsageStats({ range: selectedTimeRange })).unwrap();
    } catch (err) {
      console.error('Failed to refresh usage stats:', err);
    }
  };

  // Method to refresh activity log
  const handleRefreshActivityLog = async () => {
    try {
      await dispatch(fetchActivityLog({ range: selectedTimeRange })).unwrap();
    } catch (err) {
      console.error('Failed to refresh activity log:', err);
    }
  };

  // Method to refresh credit consumption
  const handleRefreshCreditConsumption = async () => {
    try {
      await dispatch(fetchCreditConsumption({ range: selectedTimeRange })).unwrap();
    } catch (err) {
      console.error('Failed to refresh credit consumption:', err);
    }
  };

  // Method to refresh query distribution
  const handleRefreshQueryDistribution = async () => {
    try {
      await dispatch(fetchQueryDistribution({ range: selectedTimeRange })).unwrap();
    } catch (err) {
      console.error('Failed to refresh query distribution:', err);
    }
  };

  // Method to refresh top documents
  const handleRefreshTopDocuments = async () => {
    try {
      await dispatch(fetchTopDocuments({ range: selectedTimeRange })).unwrap();
    } catch (err) {
      console.error('Failed to refresh top documents:', err);
    }
  };

  // Method to refresh all dashboard data
  const handleRefreshAllData = async () => {
    try {
      await dispatch(fetchAllDashboardData({ range: selectedTimeRange })).unwrap();
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err);
    }
  };

  return {
    usageStats,
    activityLog,
    creditConsumption,
    queryDistribution,
    topDocuments,
    selectedTimeRange,
    isLoading,
    error,
    changeTimeRange: handleChangeTimeRange,
    refreshUsageStats: handleRefreshUsageStats,
    refreshActivityLog: handleRefreshActivityLog,
    refreshCreditConsumption: handleRefreshCreditConsumption,
    refreshQueryDistribution: handleRefreshQueryDistribution,
    refreshTopDocuments: handleRefreshTopDocuments,
    refreshAllData: handleRefreshAllData,
  };
};
