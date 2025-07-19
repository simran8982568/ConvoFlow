import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SystemConfigurationData {
  timezone: string;
  currency: string;
  signupEnabled: boolean;
  maintenanceMode: boolean;
  termsUrl: string;
  privacyUrl: string;
}

interface SystemConfigurationCardProps {
  data: SystemConfigurationData;
  onUpdate: (field: string, value: any) => void;
  loading?: boolean;
  error?: string | null;
}

const SystemConfigurationCard: React.FC<SystemConfigurationCardProps> = ({
  data,
  onUpdate,
  loading = false,
  error
}) => {
  const timezoneOptions = [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' }
  ];

  const currencyOptions = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading system settings</p>
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
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Global system settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Configuration
        </CardTitle>
        <CardDescription>
          Global system settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={data.timezone}
              onChange={(e) => onUpdate('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={loading}
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={data.currency}
              onChange={(e) => onUpdate('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={loading}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="signupEnabled">Enable New Signups</Label>
              <p className="text-sm text-gray-600">Allow new businesses to register</p>
            </div>
            <Switch
              id="signupEnabled"
              checked={data.signupEnabled}
              onCheckedChange={(checked) => onUpdate('signupEnabled', checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className="text-sm text-gray-600">Put platform under maintenance</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={data.maintenanceMode}
              onCheckedChange={(checked) => onUpdate('maintenanceMode', checked)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="termsUrl">Terms of Service URL</Label>
            <Input
              id="termsUrl"
              value={data.termsUrl}
              onChange={(e) => onUpdate('termsUrl', e.target.value)}
              placeholder="https://ayuchat.com/terms"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
            <Input
              id="privacyUrl"
              value={data.privacyUrl}
              onChange={(e) => onUpdate('privacyUrl', e.target.value)}
              placeholder="https://ayuchat.com/privacy"
              disabled={loading}
            />
          </div>
        </div>

        {data.maintenanceMode && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-amber-800 font-medium text-sm">
              Warning: Maintenance Mode Active
            </div>
            <div className="text-amber-700 text-xs mt-1">
              Platform is currently under maintenance. Users cannot access the system.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemConfigurationCard;
