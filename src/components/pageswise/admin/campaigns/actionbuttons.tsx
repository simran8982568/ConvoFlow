// Action buttons component for campaign operations

import React, { useState } from "react";
import { Play, Pause, Edit, Trash2, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
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
  isPaused?: boolean;
  onPauseToggle?: (campaignId: number, isPaused: boolean) => void;
}

const CampaignActionButtons: React.FC<CampaignActionButtonsProps> = ({
  campaign,
  isPaused = false,
  onPauseToggle,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const {
    handleCampaignAction,
    handleDeleteCampaign,
    handleEditCampaign,
    handleViewAnalytics,
  } = useCampaignActions();

  const handlePauseClick = () => {
    const newPausedState = !isPaused;
    onPauseToggle?.(campaign.id, newPausedState);
    handleCampaignAction(newPausedState ? "Pause" : "Resume", campaign.id);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleAnalyticsClick = () => {
    setShowAnalytics(!showAnalytics);
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
        {/* Pause/Resume Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePauseClick}
          className={isPaused ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : ""}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 mr-1" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </>
          )}
        </Button>

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
          {showAnalytics ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
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

      {/* Analytics Chart - Slides down when toggled */}
      {showAnalytics && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
          <CampaignAnalyticsChart campaign={campaign} />
        </div>
      )}

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
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
              All campaign data and analytics will be permanently removed.
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
