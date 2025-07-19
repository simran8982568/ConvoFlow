// This file is deprecated. Use AdminSidebar or SuperAdminSidebar instead.
// Keeping for backward compatibility.

import React from "react";
import { UserRole } from "@/utils/auth";
import { AdminSidebar } from "./admin";
import { SuperAdminSidebar } from "./superadmin";

interface SidebarProps {
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  if (role === "admin") {
    return <AdminSidebar />;
  }

  return <SuperAdminSidebar />;
};

export default Sidebar;
