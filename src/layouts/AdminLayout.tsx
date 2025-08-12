import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ResponsiveSidebar from "@/components/common/ResponsiveSidebar";
import UserHeader from "@/components/common/UserHeader";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size for tablet detection
  useEffect(() => {
    const checkScreenSize = () => {
      const isTabletSize = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsTablet(isTabletSize);
      // On tablet, sidebar should be hidden by default
      if (isTabletSize) {
        setIsSidebarOpen(false);
      } else if (window.innerWidth >= 1024) {
        // On desktop, sidebar should be open by default
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ResponsiveSidebar role="admin" isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        } transition-all duration-300`}
      >
        {/* Mobile Header Spacer */}
        <div className="h-16 md:h-0 flex-shrink-0" />

        {/* User Header */}
        <UserHeader
          role="admin"
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

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
