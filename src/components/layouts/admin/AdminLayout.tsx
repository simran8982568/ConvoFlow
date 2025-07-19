import React from "react";
import BaseLayout from "../shared/BaseLayout";
import { AdminSidebar } from "@/components/common/admin";

const AdminLayout: React.FC = () => {
  return <BaseLayout sidebar={<AdminSidebar />} className="admin-layout" />;
};

export default AdminLayout;
