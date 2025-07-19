import React from "react";
import { Outlet } from "react-router-dom";
import ResponsiveSidebar from "@/components/common/ResponsiveSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ResponsiveSidebar role="admin" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Mobile Header Spacer */}
        <div className="h-16 md:h-0 flex-shrink-0" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;