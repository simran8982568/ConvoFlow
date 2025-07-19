import React from "react";
import { Save, Building } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LogoUpload from "./logouplode";
import { BusinessProfile as BusinessProfileType } from "../../../../api/apicall/admin/settings/apicallbusiness";

interface BusinessProfileProps {
  businessProfile: BusinessProfileType;
  setBusinessProfile: (profile: BusinessProfileType) => void;
  onSave: () => void;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({
  businessProfile,
  setBusinessProfile,
  onSave,
  onLogoUpload,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Profile
        </CardTitle>
        <CardDescription>
          Update your business information and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Upload */}
        <LogoUpload logo={businessProfile.logo} onLogoUpload={onLogoUpload} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              value={businessProfile.businessName}
              onChange={(e) =>
                setBusinessProfile({
                  ...businessProfile,
                  businessName: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={businessProfile.website}
              onChange={(e) =>
                setBusinessProfile({
                  ...businessProfile,
                  website: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={businessProfile.description}
            onChange={(e) =>
              setBusinessProfile({
                ...businessProfile,
                description: e.target.value,
              })
            }
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={businessProfile.email}
              onChange={(e) =>
                setBusinessProfile({
                  ...businessProfile,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={businessProfile.phone}
              onChange={(e) =>
                setBusinessProfile({
                  ...businessProfile,
                  phone: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={businessProfile.address}
            onChange={(e) =>
              setBusinessProfile({
                ...businessProfile,
                address: e.target.value,
              })
            }
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={businessProfile.timezone}
              onValueChange={(value) =>
                setBusinessProfile({ ...businessProfile, timezone: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time
                </SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={businessProfile.language}
              onValueChange={(value) =>
                setBusinessProfile({ ...businessProfile, language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onSave} className="bg-teal-600 hover:bg-teal-700">
          <Save className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusinessProfile;
