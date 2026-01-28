import { useState, useEffect } from 'react';

// Data interfaces
export interface PlatformBrandingData {
  platformName: string;
  supportEmail: string;
  logo: File | null;
  welcomeMessage: string;
}

export interface SystemConfigurationData {
  timezone: string;
  currency: string;
  signupEnabled: boolean;
  maintenanceMode: boolean;
  termsUrl: string;
  privacyUrl: string;
}

export interface NotificationSettings {
  newSignups: boolean;
  templateSubmissions: boolean;
  systemErrors: boolean;
  billingIssues: boolean;
}

export interface SettingsData {
  platformBranding: PlatformBrandingData;
  systemConfiguration: SystemConfigurationData;
  notifications: NotificationSettings;
}

export interface SettingsDataState {
  settings: SettingsData;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

// Mock data
const mockSettings: SettingsData = {
  platformBranding: {
    platformName: 'ConvoFlow',
    supportEmail: 'support@convoflow.com',
    logo: null,
    welcomeMessage: 'Welcome to ConvoFlow! Start your WhatsApp marketing journey today.'
  },
  systemConfiguration: {
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    signupEnabled: true,
    maintenanceMode: false,
    termsUrl: 'https://convoflow.com/terms',
    privacyUrl: 'https://convoflow.com/privacy'
  },
  notifications: {
    newSignups: true,
    templateSubmissions: true,
    systemErrors: true,
    billingIssues: true
  }
};

// Simulate API calls with delays and potential errors
const simulateAPICall = <T,>(data: T, delay: number = 800, errorRate: number = 0.05): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to communicate with server'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for settings data management
export const useSettingsData = () => {
  const [state, setState] = useState<SettingsDataState>({
    settings: mockSettings,
    loading: true,
    error: null,
    saving: false
  });

  const fetchSettings = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const settings = await simulateAPICall(mockSettings, 1000, 0.05);
      setState(prev => ({
        ...prev,
        settings,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const updatePlatformBranding = (field: string, value: any) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        platformBranding: {
          ...prev.settings.platformBranding,
          [field]: value
        }
      }
    }));
  };

  const updateSystemConfiguration = (field: string, value: any) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        systemConfiguration: {
          ...prev.settings.systemConfiguration,
          [field]: value
        }
      }
    }));
  };

  const updateNotifications = (field: string, value: boolean) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: {
          ...prev.settings.notifications,
          [field]: value
        }
      }
    }));
  };

  const saveSettings = async (): Promise<void> => {
    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      await simulateAPICall({ success: true }, 1500, 0.08);
      
      console.log('Settings saved successfully:', state.settings);
      
      setState(prev => ({
        ...prev,
        saving: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to save settings'
      }));
      throw error;
    }
  };

  const resetSettings = () => {
    setState(prev => ({
      ...prev,
      settings: mockSettings
    }));
  };

  const refetchSettings = () => {
    fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    ...state,
    updatePlatformBranding,
    updateSystemConfiguration,
    updateNotifications,
    saveSettings,
    resetSettings,
    refetchSettings
  };
};

// Security actions
export const securityActions = {
  changePassword: async (): Promise<void> => {
    await simulateAPICall({ success: true }, 1000, 0.05);
    console.log('Password changed successfully');
  },

  viewAccessLogs: async (): Promise<any[]> => {
    const mockLogs = [
      { timestamp: new Date(), action: 'Login', user: 'admin', ip: '192.168.1.1' },
      { timestamp: new Date(Date.now() - 3600000), action: 'Settings Update', user: 'admin', ip: '192.168.1.1' },
      { timestamp: new Date(Date.now() - 7200000), action: 'User Creation', user: 'admin', ip: '192.168.1.1' }
    ];
    
    return await simulateAPICall(mockLogs, 800, 0.05);
  },

  backupConfiguration: async (): Promise<void> => {
    await simulateAPICall({ success: true }, 2000, 0.05);
    console.log('Configuration backup created successfully');
  }
};
