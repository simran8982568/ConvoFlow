// Add phone number dialog component

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewPhoneNumberData } from "./mockdata";

interface AddPhoneNumberDialogProps {
  newPhoneNumber: NewPhoneNumberData;
  setNewPhoneNumber: (phoneNumber: NewPhoneNumberData) => void;
  onAddPhoneNumber: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: string[];
}

const AddPhoneNumberDialog: React.FC<AddPhoneNumberDialogProps> = ({
  newPhoneNumber,
  setNewPhoneNumber,
  onAddPhoneNumber,
  onCancel,
  isLoading = false,
  errors = [],
}) => {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add WhatsApp Business Phone Number</DialogTitle>
        <DialogDescription>
          Connect a new WhatsApp Business API phone number to your account
        </DialogDescription>
      </DialogHeader>
      
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Display Name */}
        <div>
          <Label htmlFor="display-name">Display Name *</Label>
          <Input
            id="display-name"
            value={newPhoneNumber.displayName}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, displayName: e.target.value })
            }
            placeholder="e.g., Main Business Line"
            disabled={isLoading}
          />
        </div>

        {/* Business ID */}
        <div>
          <Label htmlFor="business-id">Business Account ID *</Label>
          <Input
            id="business-id"
            value={newPhoneNumber.businessId}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, businessId: e.target.value })
            }
            placeholder="Your WhatsApp Business Account ID"
            disabled={isLoading}
          />
        </div>

        {/* App ID */}
        <div>
          <Label htmlFor="app-id">App ID *</Label>
          <Input
            id="app-id"
            value={newPhoneNumber.appId}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, appId: e.target.value })
            }
            placeholder="Your WhatsApp App ID"
            disabled={isLoading}
          />
        </div>

        {/* Phone Number ID */}
        <div>
          <Label htmlFor="phone-number-id">Phone Number ID *</Label>
          <Input
            id="phone-number-id"
            value={newPhoneNumber.phoneNumberId}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, phoneNumberId: e.target.value })
            }
            placeholder="Your WhatsApp Phone Number ID"
            disabled={isLoading}
          />
        </div>

        {/* Access Token */}
        <div>
          <Label htmlFor="access-token">Access Token *</Label>
          <Input
            id="access-token"
            type="password"
            value={newPhoneNumber.accessToken}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, accessToken: e.target.value })
            }
            placeholder="Your WhatsApp Access Token"
            disabled={isLoading}
          />
        </div>

        {/* Webhook URL */}
        <div>
          <Label htmlFor="webhook-url">Webhook URL *</Label>
          <Input
            id="webhook-url"
            value={newPhoneNumber.webhookUrl}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, webhookUrl: e.target.value })
            }
            placeholder="https://your-domain.com/webhook"
            disabled={isLoading}
          />
        </div>

        {/* Verify Token */}
        <div>
          <Label htmlFor="verify-token">Verify Token *</Label>
          <Input
            id="verify-token"
            value={newPhoneNumber.verifyToken}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, verifyToken: e.target.value })
            }
            placeholder="Your webhook verify token"
            disabled={isLoading}
          />
        </div>

        {/* Help Text */}
        <Alert>
          <AlertDescription>
            <strong>Need help?</strong> You can find these values in your Meta for Developers dashboard 
            under your WhatsApp Business App configuration.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onAddPhoneNumber}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Phone Number"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddPhoneNumberDialog;
