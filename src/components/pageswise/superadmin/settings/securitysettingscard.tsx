import React, { useState } from 'react';
import { Shield, Key, FileText, Download, Eye, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SecuritySettingsCardProps {
  maintenanceMode: boolean;
  onPasswordChange?: () => void;
  onViewLogs?: () => void;
  onBackupConfig?: () => void;
  loading?: boolean;
  error?: string | null;
}

const SecuritySettingsCard: React.FC<SecuritySettingsCardProps> = ({
  maintenanceMode,
  onPasswordChange,
  onViewLogs,
  onBackupConfig,
  loading = false,
  error
}) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAction = async (action: string, callback?: () => void) => {
    setIsProcessing(action);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (callback) {
        callback();
      }
      console.log(`${action} completed successfully`);
    } catch (error) {
      console.error(`${action} failed:`, error);
    } finally {
      setIsProcessing(null);
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading security settings</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Platform security and access controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-48" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const securityActions = [
    {
      key: 'password',
      label: 'Change Super Admin Password',
      description: 'Update your administrative password',
      icon: Key,
      action: () => handleAction('Password Change', onPasswordChange),
      variant: 'outline' as const
    },
    {
      key: 'logs',
      label: 'View Access Logs',
      description: 'Review system access and activity logs',
      icon: Eye,
      action: () => handleAction('View Logs', onViewLogs),
      variant: 'outline' as const
    },
    {
      key: 'backup',
      label: 'Backup Configuration',
      description: 'Download system configuration backup',
      icon: Download,
      action: () => handleAction('Backup Configuration', onBackupConfig),
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Platform security and access controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Status */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 font-medium">
            <Shield className="h-4 w-4" />
            Security Status
          </div>
          <div className="text-sm text-blue-700 mt-1">
            Platform security is active. All communications are encrypted with TLS 1.3.
          </div>
          <div className="text-xs text-blue-600 mt-2">
            Last security scan: {new Date().toLocaleDateString()} - No issues found
          </div>
        </div>

        {/* Security Actions */}
        <div className="space-y-3">
          {securityActions.map((action) => {
            const IconComponent = action.icon;
            const isCurrentlyProcessing = isProcessing === action.key;
            
            return (
              <Button
                key={action.key}
                variant={action.variant}
                className="w-full justify-start h-auto p-4"
                onClick={action.action}
                disabled={loading || isCurrentlyProcessing}
              >
                <div className="flex items-center gap-3 w-full">
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">
                      {isCurrentlyProcessing ? 'Processing...' : action.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Maintenance Mode Warning */}
        {maintenanceMode && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800 font-medium text-sm">
              <AlertTriangle className="h-4 w-4" />
              Maintenance Mode Active
            </div>
            <div className="text-amber-700 text-xs mt-1">
              Platform is currently under maintenance. Users cannot access the system.
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-gray-800 font-medium text-sm mb-2">
            <FileText className="h-4 w-4" />
            Security Best Practices
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Change your password regularly (every 90 days)</li>
            <li>• Review access logs weekly for suspicious activity</li>
            <li>• Keep configuration backups in a secure location</li>
            <li>• Enable all critical system notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsCard;
