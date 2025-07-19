import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
  redirectTo?: string;
}

// Unconditionally render children for unrestricted navigation
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
