import React, { ReactNode } from 'react';
import FriSidebar from './FriSidebar';
import FriTopBar from './FriTopBar';

interface FriDashboardLayoutProps {
  children: ReactNode;
}

const FriDashboardLayout: React.FC<FriDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <FriSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <FriTopBar />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriDashboardLayout;
