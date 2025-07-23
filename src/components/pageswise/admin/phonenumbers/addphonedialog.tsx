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
        {/* Phone Label */}
        <div>
          <Label htmlFor="phone-label">Phone Label *</Label>
          <Input
            id="phone-label"
            value={newPhoneNumber.displayName}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, displayName: e.target.value })
            }
            placeholder="e.g., Support Line"
            disabled={isLoading}
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone-number">Phone Number *</Label>
          <Input
            id="phone-number"
            value={newPhoneNumber.phoneNumber || ''}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, phoneNumber: e.target.value })
            }
            placeholder="e.g., +1234567890"
            disabled={isLoading}
          />
        </div>

        {/* Business ID */}
        <div>
          <Label htmlFor="business-id">Business ID *</Label>
          <Input
            id="business-id"
            value={newPhoneNumber.businessId}
            onChange={(e) =>
              setNewPhoneNumber({ ...newPhoneNumber, businessId: e.target.value })
            }
            placeholder="Your WhatsApp Business ID"
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
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Number"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddPhoneNumberDialog;
