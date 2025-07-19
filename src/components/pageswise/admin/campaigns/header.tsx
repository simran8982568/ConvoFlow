// Header component for campaigns page

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface CampaignsHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  children?: React.ReactNode; // For the dialog content
}

const CampaignsHeader: React.FC<CampaignsHeaderProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-gray-600 mt-1">
          Create and manage your WhatsApp marketing campaigns
        </p>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </DialogTrigger>
        {children}
      </Dialog>
    </div>
  );
};

export default CampaignsHeader;
