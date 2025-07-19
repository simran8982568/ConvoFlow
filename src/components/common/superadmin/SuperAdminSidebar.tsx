import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings,
  FileText,
  BarChart3,
  LogOut,
  Building2,
  ScrollText,
  DollarSign,
  Shield
} from 'lucide-react';
import { authService } from '@/utils/auth';
import { Button } from '@/components/ui/button';

const SuperAdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/superadmin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin/dashboard' },
    { icon: Building2, label: 'Businesses', path: '/superadmin/businesses' },
    { icon: FileText, label: 'Templates', path: '/superadmin/templates' },
    { icon: BarChart3, label: 'Analytics', path: '/superadmin/analytics' },
    { icon: DollarSign, label: 'Plans', path: '/superadmin/plans' },
    { icon: ScrollText, label: 'Logs', path: '/superadmin/logs' },
    { icon: Settings, label: 'Settings', path: '/superadmin/settings' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">AyuChat Admin</span>
        </div>
      </div>



      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
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
};

export default SuperAdminSidebar;
