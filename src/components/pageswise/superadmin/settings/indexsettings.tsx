import React from 'react';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import components
import PlatformBrandingCard from './platformbrandingcard';
import SystemConfigurationCard from './systemconfigurationcard';
import NotificationSettingsCard from './notificationsettingscard';
import SecuritySettingsCard from './securitysettingscard';
import ErrorBoundary from './errorboundary';

// Import data hook and actions
import { useSettingsData, securityActions } from './settingsdata';

const SuperAdminSettings: React.FC = () => {
  const { toast } = useToast();

  // Use the settings data hook
  const {
    settings,
    loading,
    error,
    saving,
    updatePlatformBranding,
    updateSystemConfiguration,
    updateNotifications,
    saveSettings,
    refetchSettings
  } = useSettingsData();

  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      toast({
        title: "Settings Saved",
        description: "Platform settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetchSettings();
    toast({
      title: "Settings Refreshed",
      description: "Settings data has been refreshed successfully.",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here.",
    });
  };

  const handleViewLogs = async () => {
    try {
      const logs = await securityActions.viewAccessLogs();
      console.log('Access logs:', logs);
      toast({
        title: "Access Logs",
        description: "Access logs have been retrieved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrieve access logs.",
        variant: "destructive",
      });
    }
  };

  const handleBackupConfig = async () => {
    try {
      await securityActions.backupConfiguration();
      toast({
        title: "Backup Created",
        description: "Configuration backup has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create configuration backup.",
        variant: "destructive",
      });
    }
  };

  // Show global error state
  if (error && !loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load Settings
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
            <p className="text-gray-600 mt-1">Configure global platform preferences and branding</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={loading || saving}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={loading || saving}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Branding */}
          <PlatformBrandingCard
            data={settings.platformBranding}
            onUpdate={updatePlatformBranding}
            loading={loading}
            error={error}
          />

          {/* System Configuration */}
          <SystemConfigurationCard
            data={settings.systemConfiguration}
            onUpdate={updateSystemConfiguration}
            loading={loading}
            error={error}
          />

          {/* Notification Settings */}
          <NotificationSettingsCard
            data={settings.notifications}
            onUpdate={updateNotifications}
            loading={loading}
            error={error}
          />

          {/* Security Settings */}
          <SecuritySettingsCard
            maintenanceMode={settings.systemConfiguration.maintenanceMode}
            onPasswordChange={handlePasswordChange}
            onViewLogs={handleViewLogs}
            onBackupConfig={handleBackupConfig}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SuperAdminSettings;
