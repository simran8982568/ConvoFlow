import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Send,
  Zap,
  FileText,
  Phone,
  BarChart3,
  LogOut,
  Building2,
  ScrollText,
  Shield,
  Menu,
  X,
  DollarSign,
} from "lucide-react";
import { authService, UserRole } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface ResponsiveSidebarProps {
  role: UserRole;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ role }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  // Handle potential auth errors gracefully
  if (
    !user &&
    (location.pathname.includes("/admin/") ||
      location.pathname.includes("/superadmin/"))
  ) {
    // Redirect to login if user is not authenticated on protected routes
    React.useEffect(() => {
      navigate(role === "admin" ? "/admin/login" : "/superadmin/login");
    }, [navigate, role]);
    return null;
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate(role === "admin" ? "/admin/login" : "/superadmin/login");
  };

  const adminMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Inbox", path: "/admin/inbox" },
    { icon: Send, label: "Campaigns", path: "/admin/campaigns" },
    { icon: Users, label: "Contacts", path: "/admin/contacts" },
    { icon: Zap, label: "Automation", path: "/admin/automation" },
    { icon: FileText, label: "Templates", path: "/admin/templates" },
    { icon: Phone, label: "Phone Numbers", path: "/admin/phone-numbers" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  ];

  const superAdminMenuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/superadmin/dashboard",
    },
    { icon: Building2, label: "Businesses", path: "/superadmin/businesses" },
    { icon: FileText, label: "Templates", path: "/superadmin/templates" },
    { icon: DollarSign, label: "Revenue", path: "/superadmin/revenue" },
    { icon: BarChart3, label: "Analytics", path: "/superadmin/analytics" },
    { icon: ScrollText, label: "Logs", path: "/superadmin/logs" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : superAdminMenuItems;
  const brandColor = role === "admin" ? "teal" : "purple";
  const brandIcon = role === "admin" ? MessageSquare : Shield;
  const brandName = role === "admin" ? "AyuChat" : "AyuChat Admin";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 min-w-[256px]">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center",
              brandColor === "teal" ? "bg-teal-600" : "bg-purple-600"
            )}
          >
            {React.createElement(brandIcon, {
              className: "h-6 w-6 sm:h-5 sm:w-5 text-white",
            })}
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            {brandName}
          </span>
        </div>
        {/* Mobile close button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-4 sm:space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-lg font-semibold rounded-lg transition-colors sm:px-3 sm:py-2 sm:text-sm sm:font-medium",
                isActive
                  ? brandColor === "teal"
                    ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                    : "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="mr-4 h-7 w-7 flex-shrink-0 sm:mr-3 sm:h-5 sm:w-5" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-gray-900 text-lg font-semibold py-3 sm:text-sm sm:font-medium sm:py-2"
        >
          <LogOut className="mr-4 h-7 w-7 sm:mr-3 sm:h-5 sm:w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-white shadow-lg border-gray-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {sidebarContent}
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 z-50 md:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default ResponsiveSidebar;
