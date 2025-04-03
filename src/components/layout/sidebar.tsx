import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector } from '@/hooks/useRedux';

interface SidebarLinkProps {
  href: string;
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, text, icon, isActive = false }) => {
  return (
    <Link
      href={href}
      className={classNames(
        'flex items-center px-4 py-3 text-sm font-medium rounded-md',
        isActive
          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      )}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      {text}
    </Link>
  );
};

interface SidebarSubmenuLinkProps {
  href: string;
  text: string;
  isActive?: boolean;
}

const SidebarSubmenuLink: React.FC<SidebarSubmenuLinkProps> = ({
  href,
  text,
  isActive = false,
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        'pl-10 pr-4 py-2 text-sm font-medium rounded-md block',
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      )}
    >
      {text}
    </Link>
  );
};

interface SidebarSubmenuProps {
  text: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  isActive?: boolean;
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  text,
  icon,
  children,
  isOpen: defaultIsOpen = false,
  isActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen || isActive);

  return (
    <div>
      <button
        className={classNames(
          'w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md',
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="mr-3 h-5 w-5">{icon}</span>
          {text}
        </div>
        {isOpen ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="w-64 h-screen bg-white dark:bg-secondary-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 fixed left-0 top-0 z-10">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Airiam RAG
        </Link>
      </div>
      <nav className="mt-4 px-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        <SidebarLink
          href="/dashboard"
          text="Dashboard"
          icon={<HomeIcon />}
          isActive={pathname === '/dashboard'}
        />
        <SidebarLink
          href="/chat"
          text="Chat"
          icon={<ChatBubbleLeftRightIcon />}
          isActive={pathname === '/chat' || pathname.startsWith('/chat/')}
        />
        <SidebarLink
          href="/files"
          text="File Analysis"
          icon={<DocumentIcon />}
          isActive={pathname === '/files' || pathname.startsWith('/files/')}
        />
        <SidebarLink
          href="/analytics"
          text="Analytics"
          icon={<ChartBarIcon />}
          isActive={pathname === '/analytics' || pathname.startsWith('/analytics/')}
        />
        {isAdmin && (
          <>
            <SidebarSubmenu
              text="Admin"
              icon={<Cog6ToothIcon />}
              isActive={pathname.startsWith('/admin')}
            >
              <SidebarSubmenuLink
                href="/admin/users"
                text="User Management"
                isActive={pathname === '/admin/users' || pathname.startsWith('/admin/users/')}
              />
              <SidebarSubmenuLink
                href="/admin/tenants"
                text="Tenant Management"
                isActive={pathname === '/admin/tenants' || pathname.startsWith('/admin/tenants/')}
              />
              <SidebarSubmenuLink
                href="/admin/settings"
                text="Settings"
                isActive={pathname === '/admin/settings'}
              />
            </SidebarSubmenu>
          </>
        )}
      </nav>
    </div>
  );
};
