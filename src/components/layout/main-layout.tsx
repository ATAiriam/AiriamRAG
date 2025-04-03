'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, requireAuth = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isInitialized } = useAuth({ requireAuth });
  const router = useRouter();

  // Handle mobile sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  if (requireAuth && !isAuthenticated && isInitialized) {
    return null; // The useAuth hook will handle redirection
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-secondary-900">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-secondary-900 transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen ml-0 lg:ml-64">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 mt-16 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
