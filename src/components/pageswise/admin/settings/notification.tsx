import React from "react";
import { Save, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NotificationSettings } from "../../../../api/apicall/admin/settings/apicallnotification";

interface NotificationProps {
  notifications: NotificationSettings;
  setNotifications: (notifications: NotificationSettings) => void;
  onSave: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  notifications,
  setNotifications,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                emailNotifications: checked,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notifications">SMS Notifications</Label>
          <Switch
            id="sms-notifications"
            checked={notifications.smsNotifications}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, smsNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="campaign-updates">Campaign Updates</Label>
          <Switch
            id="campaign-updates"
            checked={notifications.campaignUpdates}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, campaignUpdates: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="system-alerts">System Alerts</Label>
          <Switch
            id="system-alerts"
            checked={notifications.systemAlerts}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, systemAlerts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="weekly-reports">Weekly Reports</Label>
          <Switch
            id="weekly-reports"
            checked={notifications.weeklyReports}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, weeklyReports: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="new-contacts">New Contacts</Label>
          <Switch
            id="new-contacts"
            checked={notifications.newContacts}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, newContacts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="failed-messages">Failed Messages</Label>
          <Switch
            id="failed-messages"
            checked={notifications.failedMessages}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, failedMessages: checked })
            }
          />
        </div>

        <Button onClick={onSave} variant="outline" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Notifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default Notification;
