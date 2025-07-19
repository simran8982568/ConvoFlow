import React from 'react';
import { Mail, Bell, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationSettings {
  newSignups: boolean;
  templateSubmissions: boolean;
  systemErrors: boolean;
  billingIssues: boolean;
}

interface NotificationSettingsCardProps {
  data: NotificationSettings;
  onUpdate: (field: string, value: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  data,
  onUpdate,
  loading = false,
  error
}) => {
  const notificationOptions = [
    {
      key: 'newSignups',
      label: 'New Business Signups',
      description: 'Get notified when new businesses register',
      icon: Bell,
      value: data.newSignups
    },
    {
      key: 'templateSubmissions',
      label: 'Template Submissions',
      description: 'Get notified when templates are submitted for approval',
      icon: Mail,
      value: data.templateSubmissions
    },
    {
      key: 'systemErrors',
      label: 'System Errors',
      description: 'Get notified about critical system errors',
      icon: AlertCircle,
      value: data.systemErrors
    },
    {
      key: 'billingIssues',
      label: 'Billing Issues',
      description: 'Get notified about payment failures and billing problems',
      icon: AlertCircle,
      value: data.billingIssues
    }
  ];

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Mail className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading notification settings</p>
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
            <Mail className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure which events trigger notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
              </div>
              <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const enabledCount = Object.values(data).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Notification Settings
          <span className="ml-auto text-sm font-normal text-gray-500">
            {enabledCount} of {notificationOptions.length} enabled
          </span>
        </CardTitle>
        <CardDescription>
          Configure which events trigger notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div key={option.key} className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <IconComponent className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium">{option.label}</Label>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              <Switch
                checked={option.value}
                onCheckedChange={(checked) => onUpdate(option.key, checked)}
                disabled={loading}
              />
            </div>
          );
        })}

        {enabledCount === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium text-sm">No notifications enabled</span>
            </div>
            <div className="text-yellow-700 text-xs mt-1">
              You won't receive any system notifications. Consider enabling at least system errors.
            </div>
          </div>
        )}

        {data.systemErrors && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Bell className="h-4 w-4" />
              <span className="font-medium text-sm">Critical notifications enabled</span>
            </div>
            <div className="text-green-700 text-xs mt-1">
              You'll be notified about important system events and errors.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
