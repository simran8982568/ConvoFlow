import React from 'react';
import { AlertTriangle, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NotFoundProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  onBack?: () => void;
  onHome?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true,
  showHomeButton = true,
  onBack,
  onHome
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/superadmin/dashboard';
    }
  };

  const commonPages = [
    { name: 'Dashboard', path: '/superadmin/dashboard', icon: Home },
    { name: 'Businesses', path: '/superadmin/businesses', icon: Search },
    { name: 'Templates', path: '/superadmin/templates', icon: Search },
    { name: 'Analytics', path: '/superadmin/analytics', icon: Search },
    { name: 'Plans', path: '/superadmin/plans', icon: Search },
    { name: 'Settings', path: '/superadmin/settings', icon: Search },
    { name: 'Logs', path: '/superadmin/logs', icon: Search }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Error Icon */}
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>

            {/* Error Code */}
            <div className="text-6xl font-bold text-gray-300 mb-4">404</div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>

            {/* Message */}
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              )}
              {showHomeButton && (
                <Button
                  onClick={handleHome}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
            </div>

            {/* Quick Links */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {commonPages.map((page) => {
                  const IconComponent = page.icon;
                  return (
                    <a
                      key={page.name}
                      href={page.path}
                      className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <IconComponent className="h-4 w-4" />
                      {page.name}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need help?</strong> If you believe this is an error, please contact the system administrator or check the URL for typos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
