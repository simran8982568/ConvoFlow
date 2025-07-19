import React from "react";
import { Save, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { WhatsAppSettings } from "../../../../api/apicall/admin/settings/apicallwhatappsettings";

interface WhatsAppProps {
  whatsappSettings: WhatsAppSettings;
  setWhatsappSettings: (settings: WhatsAppSettings) => void;
  onSave: () => void;
}

const WhatsApp: React.FC<WhatsAppProps> = ({
  whatsappSettings,
  setWhatsappSettings,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          WhatsApp Settings
        </CardTitle>
        <CardDescription>
          Configure your WhatsApp business preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="default-template">Default Template</Label>
          <Select
            value={whatsappSettings.defaultTemplate}
            onValueChange={(value) =>
              setWhatsappSettings({
                ...whatsappSettings,
                defaultTemplate: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Welcome Message">Welcome Message</SelectItem>
              <SelectItem value="Order Confirmation">
                Order Confirmation
              </SelectItem>
              <SelectItem value="Support Response">Support Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-reply">Auto Reply</Label>
            <p className="text-sm text-gray-500">
              Automatically respond to new messages
            </p>
          </div>
          <Switch
            id="auto-reply"
            checked={whatsappSettings.autoReply}
            onCheckedChange={(checked) =>
              setWhatsappSettings({ ...whatsappSettings, autoReply: checked })
            }
          />
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label htmlFor="business-hours">Business Hours</Label>
              <p className="text-sm text-gray-500">
                Set your business operating hours
              </p>
            </div>
            <Switch
              id="business-hours"
              checked={whatsappSettings.businessHours.enabled}
              onCheckedChange={(checked) =>
                setWhatsappSettings({
                  ...whatsappSettings,
                  businessHours: {
                    ...whatsappSettings.businessHours,
                    enabled: checked,
                  },
                })
              }
            />
          </div>

          {whatsappSettings.businessHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={whatsappSettings.businessHours.start}
                  onChange={(e) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      businessHours: {
                        ...whatsappSettings.businessHours,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={whatsappSettings.businessHours.end}
                  onChange={(e) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      businessHours: {
                        ...whatsappSettings.businessHours,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="away-message">Away Message</Label>
          <Textarea
            id="away-message"
            value={whatsappSettings.awayMessage}
            onChange={(e) =>
              setWhatsappSettings({
                ...whatsappSettings,
                awayMessage: e.target.value,
              })
            }
            rows={3}
            placeholder="Message to send when outside business hours"
          />
        </div>

        <Button onClick={onSave} className="bg-teal-600 hover:bg-teal-700">
          <Save className="w-4 h-4 mr-2" />
          Save WhatsApp Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsApp;
