// Campaign action handlers and utility functions

import { Badge } from "@/components/ui/badge";
import { Play, Pause, CheckCircle, Clock } from "lucide-react";
import { Campaign } from "./mockdata";
import { performCampaignAction } from "./apicreatecampaign";
import { useToast } from "@/hooks/use-toast";

/**
 * Get status badge component for campaign status
 * @param status - Campaign status
 * @returns JSX.Element
 */
export const getStatusBadge = (status: Campaign["status"]): JSX.Element => {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-green-100 text-green-800">
          <Play className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case "Completed":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "Scheduled":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Scheduled
        </Badge>
      );
    case "Paused":
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <Pause className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

/**
 * Get type badge component for campaign type
 * @param type - Campaign type
 * @returns JSX.Element
 */
export const getTypeBadge = (type: Campaign["type"]): JSX.Element => {
  return type === "Automated" ? (
    <Badge variant="outline" className="text-purple-600 border-purple-200">
      Automated
    </Badge>
  ) : (
    <Badge variant="outline" className="text-blue-600 border-blue-200">
      Broadcast
    </Badge>
  );
};

/**
 * Calculate open rate percentage
 * @param opened - Number of opened messages
 * @param delivered - Number of delivered messages
 * @returns string - Formatted percentage
 */
export const calculateOpenRate = (
  opened: number,
  delivered: number
): string => {
  return delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0.0";
};

/**
 * Calculate click rate percentage
 * @param clicked - Number of clicked messages
 * @param opened - Number of opened messages
 * @returns string - Formatted percentage
 */
export const calculateClickRate = (clicked: number, opened: number): string => {
  return opened > 0 ? ((clicked / opened) * 100).toFixed(1) : "0.0";
};

/**
 * Calculate average open rate for multiple campaigns
 * @param campaigns - Array of campaigns
 * @returns string - Formatted percentage
 */
export const calculateAverageOpenRate = (campaigns: Campaign[]): string => {
  if (campaigns.length === 0) return "0.0";

  const totalRate = campaigns.reduce(
    (sum, campaign) =>
      sum +
      (campaign.delivered > 0
        ? (campaign.opened / campaign.delivered) * 100
        : 0),
    0
  );

  return (totalRate / campaigns.length).toFixed(1);
};

/**
 * Get total messages sent across all campaigns
 * @param campaigns - Array of campaigns
 * @returns number - Total sent messages
 */
export const getTotalMessagesSent = (campaigns: Campaign[]): number => {
  return campaigns.reduce((sum, campaign) => sum + campaign.sent, 0);
};

/**
 * Get count of active campaigns
 * @param campaigns - Array of campaigns
 * @returns number - Count of active campaigns
 */
export const getActiveCampaignsCount = (campaigns: Campaign[]): number => {
  return campaigns.filter((campaign) => campaign.status === "Active").length;
};

/**
 * Filter campaigns based on search term, status, and type
 * @param campaigns - Array of campaigns to filter
 * @param searchTerm - Search term to match against name and template
 * @param filterStatus - Status filter ("all" or specific status)
 * @param filterType - Type filter ("all" or specific type)
 * @returns Campaign[] - Filtered campaigns
 */
export const filterCampaigns = (
  campaigns: Campaign[],
  searchTerm: string,
  filterStatus: string,
  filterType: string
): Campaign[] => {
  return campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    const matchesType = filterType === "all" || campaign.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });
};

/**
 * Custom hook for campaign actions
 * @returns Object with campaign action handlers
 */
export const useCampaignActions = () => {
  const { toast } = useToast();

  const handleCampaignAction = async (action: string, campaignId: number) => {
    try {
      const result = await performCampaignAction(action, campaignId);

      if (result.success) {
        toast({
          title: `Campaign ${action}`,
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} campaign. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: number) => {
    try {
      // TODO: Add confirmation dialog
      const confirmed = window.confirm(
        "Are you sure you want to delete this campaign?"
      );

      if (!confirmed) return;

      // TODO: Implement delete API call
      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCampaign = (campaignId: number) => {
    // TODO: Implement edit functionality
    toast({
      title: "Edit Campaign",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleViewAnalytics = (campaignId: number) => {
    // TODO: Implement analytics view
    toast({
      title: "Campaign Analytics",
      description: "Analytics view will be implemented soon.",
    });
  };

  return {
    handleCampaignAction,
    handleDeleteCampaign,
    handleEditCampaign,
    handleViewAnalytics,
  };
};

/**
 * Format date string for display
 * @param dateString - Date string to format
 * @returns string - Formatted date
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format datetime string for display
 * @param datetimeString - Datetime string to format
 * @returns string - Formatted datetime
 */
export const formatDateTime = (datetimeString: string): string => {
  try {
    const date = new Date(datetimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return datetimeString;
  }
};
