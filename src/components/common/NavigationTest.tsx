import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Send, 
  Settings,
  Zap,
  FileText,
  Phone,
  BarChart3,
  CreditCard,
  Building2,
  ScrollText,
  DollarSign
} from 'lucide-react';

const NavigationTest: React.FC = () => {
  const adminRoutes = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/inbox', label: 'Inbox', icon: MessageSquare },
    { path: '/admin/campaigns', label: 'Campaigns', icon: Send },
    { path: '/admin/contacts', label: 'Contacts', icon: Users },
    { path: '/admin/automation', label: 'Automation', icon: Zap },
    { path: '/admin/templates', label: 'Templates', icon: FileText },
    { path: '/admin/phone-numbers', label: 'Phone Numbers', icon: Phone },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/billing', label: 'Billing', icon: CreditCard },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const superAdminRoutes = [
    { path: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/superadmin/businesses', label: 'Businesses', icon: Building2 },
    { path: '/superadmin/templates', label: 'Templates', icon: FileText },
    { path: '/superadmin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/superadmin/plans', label: 'Plans', icon: DollarSign },
    { path: '/superadmin/logs', label: 'Logs', icon: ScrollText },
    { path: '/superadmin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Navigation Test</h1>
        <p className="text-gray-600 mt-1">
          Test all routes and navigation links in the application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-teal-700">Admin Routes</CardTitle>
            <CardDescription>
              Test all admin panel navigation links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {adminRoutes.map((route) => (
                <Link key={route.path} to={route.path}>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                  >
                    <route.icon className="mr-3 h-4 w-4" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SuperAdmin Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-700">SuperAdmin Routes</CardTitle>
            <CardDescription>
              Test all super admin panel navigation links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {superAdminRoutes.map((route) => (
                <Link key={route.path} to={route.path}>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                  >
                    <route.icon className="mr-3 h-4 w-4" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Routes</CardTitle>
          <CardDescription>
            Test login pages for both roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link to="/admin/login">
              <Button variant="outline" className="hover:bg-teal-50 hover:text-teal-700">
                Admin Login
              </Button>
            </Link>
            <Link to="/superadmin/login">
              <Button variant="outline" className="hover:bg-purple-50 hover:text-purple-700">
                SuperAdmin Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>
            Current application configuration and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">✅ Implemented Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Role-based routing (Admin & SuperAdmin)</li>
                <li>• Responsive sidebar navigation</li>
                <li>• Mobile-friendly design</li>
                <li>• Active route highlighting</li>
                <li>• Protected routes</li>
                <li>• All page components exist</li>
                <li>• Consistent UI design</li>
                <li>• React Router v6 integration</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">📱 Responsive Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Mobile hamburger menu</li>
                <li>• Collapsible sidebar</li>
                <li>• Touch-friendly navigation</li>
                <li>• Adaptive layouts</li>
                <li>• Mobile-optimized spacing</li>
                <li>• Responsive typography</li>
                <li>• Cross-device compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationTest;
