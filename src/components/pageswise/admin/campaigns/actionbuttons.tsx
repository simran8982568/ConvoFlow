// Action buttons component for campaign operations

import React, { useState } from "react";
import { Edit, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Campaign } from "./mockdata";
import { useCampaignActions } from "./actions";
import CampaignEditModal from "./CampaignEditModal";
import CampaignAnalyticsChart from "./CampaignAnalyticsChart";

interface CampaignActionButtonsProps {
  campaign: Campaign;
}

const CampaignActionButtons: React.FC<CampaignActionButtonsProps> = ({
  campaign,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  const {
    handleCampaignAction,
    handleDeleteCampaign,
    handleEditCampaign,
    handleViewAnalytics,
  } = useCampaignActions();



  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleAnalyticsClick = () => {
    setIsAnalyticsModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    handleDeleteCampaign(campaign.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {/* Edit Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditClick}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>

        {/* Analytics Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyticsClick}
        >
          <BarChart3 className="w-4 h-4 mr-1" />
          Analytics
        </Button>

        {/* Delete Button */}
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDeleteClick}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>

      {/* Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Analytics - {campaign.name}</DialogTitle>
            <DialogDescription>
              Detailed analytics and performance metrics for this campaign.
            </DialogDescription>
          </DialogHeader>
          <CampaignAnalyticsChart campaign={campaign} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update your campaign details and settings.
            </DialogDescription>
          </DialogHeader>
          <CampaignEditModal
            campaign={campaign}
            onClose={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The campaign "{campaign.name}" and all its data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CampaignActionButtons;
