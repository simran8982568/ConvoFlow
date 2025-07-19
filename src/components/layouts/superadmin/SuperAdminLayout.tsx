import React from "react";
import BaseLayout from "../shared/BaseLayout";
import { SuperAdminSidebar } from "@/components/common/superadmin";

const SuperAdminLayout: React.FC = () => {
  return (
    <BaseLayout sidebar={<SuperAdminSidebar />} className="superadmin-layout" />
  );
};

export default SuperAdminLayout;
