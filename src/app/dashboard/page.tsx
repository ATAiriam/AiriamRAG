'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import { ArrowPathIcon, ChatBubbleLeftRightIcon, DocumentIcon, ClockIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DashboardPage() {
  const {
    usageStats,
    creditConsumption,
    queryDistribution,
    topDocuments,
    activityLog,
    selectedTimeRange,
    isLoading,
    changeTimeRange,
    refreshAllData,
  } = useDashboard();

  const timeRangeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-white dark:bg-secondary-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1.5 text-sm font-medium ${
                  selectedTimeRange === option.value
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => changeTimeRange(option.value as any)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={refreshAllData}
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-700 dark:text-primary-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Queries</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '...' : usageStats?.totalQueries || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                <DocumentIcon className="h-5 w-5 text-green-700 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Files</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '...' : usageStats?.totalFiles || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <svg className="h-5 w-5 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tokens Consumed</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '...' : (usageStats?.totalTokensConsumed || 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <ClockIcon className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '...' : `${(usageStats?.averageResponseTime || 0).toFixed(2)}s`}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Consumption Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {creditConsumption && creditConsumption.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={creditConsumption}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="credits" stroke="#3182ce" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Query Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Query Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {queryDistribution && queryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={queryDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3182ce" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Top Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {topDocuments && topDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-secondary-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Document
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Access Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {doc.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {doc.accessCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No documents available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLog && activityLog.length > 0 ? (
            <div className="flow-root">
              <ul className="-mb-8">
                {activityLog.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== activityLog.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {activity.action.includes('file') ? (
                              <DocumentIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : activity.action.includes('conversation') ? (
                              <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              <span className="font-medium">{activity.userName}</span> {getActivityDescription(activity.action)}
                            </p>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{activity.details}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getActivityDescription(action: string): string {
  switch (action) {
    case 'file_upload':
      return 'uploaded a file';
    case 'file_delete':
      return 'deleted a file';
    case 'conversation_create':
      return 'started a conversation';
    case 'conversation_message':
      return 'sent a message';
    case 'login':
      return 'logged in';
    case 'logout':
      return 'logged out';
    default:
      return action.replace('_', ' ');
  }
}

// Import missing UserIcon
import { UserIcon } from '@heroicons/react/24/outline';
