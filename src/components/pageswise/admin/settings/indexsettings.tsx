import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Import components
import SettingsHeader from "./header";
import BusinessProfile from "./businessprofile";
import WhatsApp from "./whatapp";
import Notification from "./notification";
import Security from "./security";
import DangerZone from "./dangerzone";

// Import API hooks and types
import {
  useBusinessProfileAPI,
  BusinessProfile as BusinessProfileType,
} from "../../../../api/apicall/admin/settings/apicallbusiness";
import {
  useNotificationAPI,
  NotificationSettings,
} from "../../../../api/apicall/admin/settings/apicallnotification";
import {
  useWhatsAppAPI,
  WhatsAppSettings,
} from "../../../../api/apicall/admin/settings/apicallwhatappsettings";
import {
  useSecurityAPI,
  SecuritySettings,
} from "../../../../api/apicall/admin/settings/apisavesecuritysettings";

const AdminSettings: React.FC = () => {
  const { toast } = useToast();

  // Initialize API hooks
  const businessAPI = useBusinessProfileAPI();
  const notificationAPI = useNotificationAPI();
  const whatsappAPI = useWhatsAppAPI();
  const securityAPI = useSecurityAPI();

  // Business Profile Settings
  const [businessProfile, setBusinessProfile] = useState<BusinessProfileType>({
    businessName: "AyuChat Inc.",
    description: "Leading WhatsApp marketing automation platform",
    website: "https://ayuchat.com",
    email: "contact@ayuchat.com",
    phone: "+1234567890",
    address: "123 Business St, City, State 12345",
    logo: null,
    timezone: "America/New_York",
    language: "en",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    campaignUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    newContacts: false,
    failedMessages: true,
  });

  // Security Settings
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: "24",
    ipWhitelist: "",
    apiAccess: true,
  });

  // WhatsApp Settings
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>({
    defaultTemplate: "Welcome Message",
    autoReply: true,
    businessHours: {
      enabled: true,
      start: "09:00",
      end: "17:00",
      timezone: "America/New_York",
    },
    awayMessage:
      "Thank you for your message. We will get back to you during business hours.",
  });

  const handleSaveProfile = async () => {
    await businessAPI.saveBusinessProfile(businessProfile);
  };

  const handleSaveNotifications = async () => {
    await notificationAPI.saveNotificationSettings(notifications);
  };

  const handleSaveSecurity = async () => {
    await securityAPI.saveSecuritySettings(security);
  };

  const handleSaveWhatsApp = async () => {
    await whatsappAPI.saveWhatsAppSettings(whatsappSettings);
  };

  const handleResetApiKeys = async () => {
    await securityAPI.resetApiKeys();
  };

  const handleDeleteAccount = async () => {
    await securityAPI.deleteAccount();
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await businessAPI.uploadLogo(file);
      if (result.success) {
        setBusinessProfile({ ...businessProfile, logo: file });
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <SettingsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Profile */}
        <div className="lg:col-span-2 space-y-6">
          <BusinessProfile
            businessProfile={businessProfile}
            setBusinessProfile={setBusinessProfile}
            onSave={handleSaveProfile}
            onLogoUpload={handleLogoUpload}
          />

          <WhatsApp
            whatsappSettings={whatsappSettings}
            setWhatsappSettings={setWhatsappSettings}
            onSave={handleSaveWhatsApp}
          />
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Notification
            notifications={notifications}
            setNotifications={setNotifications}
            onSave={handleSaveNotifications}
          />

          <Security
            security={security}
            setSecurity={setSecurity}
            onSave={handleSaveSecurity}
          />

          <DangerZone
            onResetApiKeys={handleResetApiKeys}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
