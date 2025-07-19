// New campaign dialog component

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTemplates, mockAudiences } from "./mockdata";
import { NewCampaignData } from "./apicreatecampaign";

interface NewCampaignDialogProps {
  newCampaign: NewCampaignData;
  setNewCampaign: (campaign: NewCampaignData) => void;
  onCreateCampaign: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NewCampaignDialog: React.FC<NewCampaignDialogProps> = ({
  newCampaign,
  setNewCampaign,
  onCreateCampaign,
  onCancel,
  isLoading = false,
}) => {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Campaign</DialogTitle>
        <DialogDescription>
          Set up a new WhatsApp marketing campaign
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {/* Campaign Name */}
        <div>
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            value={newCampaign.name}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, name: e.target.value })
            }
            placeholder="Enter campaign name"
            disabled={isLoading}
          />
        </div>

        {/* Template and Audience */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="template">Template</Label>
            <Select
              value={newCampaign.template}
              onValueChange={(value) =>
                setNewCampaign({ ...newCampaign, template: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {mockTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.name}>
                    {template.name} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="audience">Target Audience</Label>
            <Select
              value={newCampaign.audience}
              onValueChange={(value) =>
                setNewCampaign({ ...newCampaign, audience: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                {mockAudiences.map((audience) => (
                  <SelectItem key={audience.id} value={audience.name}>
                    {audience.name} ({audience.count} contacts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Campaign Type */}
        <div>
          <Label htmlFor="type">Campaign Type</Label>
          <Select
            value={newCampaign.type}
            onValueChange={(value) =>
              setNewCampaign({
                ...newCampaign,
                type: value as "Broadcast" | "Automated",
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Broadcast">Broadcast (One-time)</SelectItem>
              <SelectItem value="Automated">
                Automated (Trigger-based)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Schedule Date</Label>
            <Input
              id="date"
              type="date"
              value={newCampaign.scheduledDate}
              onChange={(e) =>
                setNewCampaign({
                  ...newCampaign,
                  scheduledDate: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="time">Schedule Time</Label>
            <Input
              id="time"
              type="time"
              value={newCampaign.scheduledTime}
              onChange={(e) =>
                setNewCampaign({
                  ...newCampaign,
                  scheduledTime: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onCreateCampaign}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default NewCampaignDialog;
