import React from 'react';
import { RefreshCw, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authService } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { getUserAvatarPath } from '@/utils/assets';

interface UserHeaderProps {
  role: 'admin' | 'superadmin';
  onRefresh?: () => void;
  refreshing?: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({ 
  role, 
  onRefresh, 
  refreshing = false 
}) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate(role === 'admin' ? '/admin/login' : '/superadmin/login');
  };

  const brandColor = role === 'admin' ? 'teal' : 'purple';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-end gap-4">
        {/* Refresh Button */}
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}

        {/* User Details */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto">
              {/* User Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                brandColor === 'teal' ? 'bg-teal-100' : 'bg-purple-100'
              }`}>
                {user?.avatar ? (
                  <img
                    src={getUserAvatarPath(user.avatar)}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className={`h-4 w-4 ${
                    brandColor === 'teal' ? 'text-teal-600' : 'text-purple-600'
                  }`} />
                )}
              </div>
              
              {/* User Info */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {role === 'admin' 
                    ? (user?.company || user?.email || 'Admin') 
                    : 'Super Administrator'
                  }
                </span>
              </div>
              
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate(`/${role}/settings`)}>
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate(`/${role}/billing`)}>
              {role === 'admin' ? 'Billing' : 'Plans'}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UserHeader;
