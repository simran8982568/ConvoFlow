import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/common/shared/ErrorBoundary';

interface BaseLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ 
  sidebar, 
  header,
  className = ''
}) => {
  return (
    <ErrorBoundary>
      <div className={`flex h-screen bg-gray-50 ${className}`}>
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          {sidebar}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {header && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              {header}
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default BaseLayout;
