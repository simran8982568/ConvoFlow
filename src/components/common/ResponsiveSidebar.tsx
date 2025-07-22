import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { authService, UserRole } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  if (!user && (location.pathname.includes('/admin/') || location.pathname.includes('/superadmin/'))) {
    // Redirect to login if user is not authenticated on protected routes
    React.useEffect(() => {
      navigate(role === 'admin' ? '/admin/login' : '/superadmin/login');
    }, [navigate, role]);
    return null;
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate(role === 'admin' ? '/admin/login' : '/superadmin/login');
  };

  const adminMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MessageSquare, label: 'Inbox', path: '/admin/inbox' },
    { icon: Send, label: 'Campaigns', path: '/admin/campaigns' },
    { icon: Users, label: 'Contacts', path: '/admin/contacts' },
    { icon: Zap, label: 'Automation', path: '/admin/automation' },
    { icon: FileText, label: 'Templates', path: '/admin/templates' },
    { icon: Phone, label: 'Phone Numbers', path: '/admin/phone-numbers' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ];

  const superAdminMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin/dashboard' },
    { icon: Building2, label: 'Businesses', path: '/superadmin/businesses' },
    { icon: FileText, label: 'Templates', path: '/superadmin/templates' },
    { icon: BarChart3, label: 'Analytics', path: '/superadmin/analytics' },
    { icon: ScrollText, label: 'Logs', path: '/superadmin/logs' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : superAdminMenuItems;
  const brandColor = role === 'admin' ? 'teal' : 'purple';
  const brandIcon = role === 'admin' ? MessageSquare : Shield;
  const brandName = role === 'admin' ? 'AyuChat' : 'AyuChat Admin';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            brandColor === 'teal' ? 'bg-teal-600' : 'bg-purple-600'
          )}>
            {React.createElement(brandIcon, { className: "h-5 w-5 text-white" })}
          </div>
          <span className="text-xl font-bold text-gray-900">{brandName}</span>
        </div>
        
        {/* Mobile close button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>



      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? brandColor === 'teal'
                    ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600'
                    : 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
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
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-4 w-4" />
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
