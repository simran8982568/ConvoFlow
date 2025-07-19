// Header component for phone numbers page

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface PhoneNumbersHeaderProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  children?: React.ReactNode; // For the dialog content
}

const PhoneNumbersHeader: React.FC<PhoneNumbersHeaderProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Phone Numbers</h1>
        <p className="text-gray-600 mt-1">
          Manage your WhatsApp Business API phone number connections
        </p>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Phone Number
          </Button>
        </DialogTrigger>
        {children}
      </Dialog>
    </div>
  );
};

export default PhoneNumbersHeader;
