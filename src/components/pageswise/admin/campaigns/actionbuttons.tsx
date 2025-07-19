// Action buttons component for campaign operations

import React from "react";
import { Play, Pause, Edit, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campaign } from "./mockdata";
import { useCampaignActions } from "./actions";

interface CampaignActionButtonsProps {
  campaign: Campaign;
}

const CampaignActionButtons: React.FC<CampaignActionButtonsProps> = ({
  campaign,
}) => {
  const {
    handleCampaignAction,
    handleDeleteCampaign,
    handleEditCampaign,
    handleViewAnalytics,
  } = useCampaignActions();

  return (
    <div className="flex gap-2">
      {/* Status-specific action buttons */}
      {campaign.status === "Active" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCampaignAction("Pause", campaign.id)}
        >
          <Pause className="w-4 h-4 mr-1" />
          Pause
        </Button>
      )}

      {campaign.status === "Paused" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCampaignAction("Resume", campaign.id)}
        >
          <Play className="w-4 h-4 mr-1" />
          Resume
        </Button>
      )}

      {campaign.status === "Scheduled" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCampaignAction("Start", campaign.id)}
        >
          <Play className="w-4 h-4 mr-1" />
          Start Now
        </Button>
      )}

      {/* Common action buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEditCampaign(campaign.id)}
      >
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewAnalytics(campaign.id)}
      >
        <BarChart3 className="w-4 h-4 mr-1" />
        Analytics
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => handleDeleteCampaign(campaign.id)}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
    </div>
  );
};

export default CampaignActionButtons;
