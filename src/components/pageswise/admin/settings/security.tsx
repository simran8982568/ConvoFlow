import React from "react";
import { Save, Shield } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SecuritySettings } from "../../../../api/apicall/admin/settings/apisavesecuritysettings";

interface SecurityProps {
  security: SecuritySettings;
  setSecurity: (security: SecuritySettings) => void;
  onSave: () => void;
}

const Security: React.FC<SecurityProps> = ({
  security,
  setSecurity,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="two-factor">Two-Factor Auth</Label>
            <p className="text-xs text-gray-500">
              Add extra security to your account
            </p>
          </div>
          <Switch
            id="two-factor"
            checked={security.twoFactorAuth}
            onCheckedChange={(checked) =>
              setSecurity({ ...security, twoFactorAuth: checked })
            }
          />
        </div>

        <div>
          <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
          <Select
            value={security.sessionTimeout}
            onValueChange={(value) =>
              setSecurity({ ...security, sessionTimeout: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="8">8 hours</SelectItem>
              <SelectItem value="24">24 hours</SelectItem>
              <SelectItem value="168">1 week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="api-access">API Access</Label>
          <Switch
            id="api-access"
            checked={security.apiAccess}
            onCheckedChange={(checked) =>
              setSecurity({ ...security, apiAccess: checked })
            }
          />
        </div>

        <Button onClick={onSave} variant="outline" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Security
        </Button>
      </CardContent>
    </Card>
  );
};

export default Security;
