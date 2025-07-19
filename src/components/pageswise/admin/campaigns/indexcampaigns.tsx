import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Import organized components
import { mockCampaigns } from "./mockdata";
import { filterCampaigns } from "./actions";
import { createCampaign, NewCampaignData } from "./apicreatecampaign";
import CampaignsHeader from "./header";
import CampaignStatsCards from "./cards";
import CampaignFilters from "./filters";
import CampaignsGrid from "./campaignsgrid";
import NewCampaignDialog from "./newcampaign";

const AdminCampaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state for creating new campaign
  const [newCampaign, setNewCampaign] = useState<NewCampaignData>({
    name: "",
    template: "",
    audience: "",
    type: "Broadcast",
    scheduledDate: "",
    scheduledTime: "",
  });

  // Filter campaigns using the utility function
  const filteredCampaigns = filterCampaigns(
    mockCampaigns,
    searchTerm,
    filterStatus,
    filterType
  );

  const handleCreateCampaign = async () => {
    setIsLoading(true);
    try {
      const result = await createCampaign(newCampaign);

      if (result.success) {
        toast({
          title: "Campaign Created",
          description: result.message,
        });
        setIsCreateDialogOpen(false);
        setNewCampaign({
          name: "",
          template: "",
          audience: "",
          type: "Broadcast",
          scheduledDate: "",
          scheduledTime: "",
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
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setIsCreateDialogOpen(false);
    setNewCampaign({
      name: "",
      template: "",
      audience: "",
      type: "Broadcast",
      scheduledDate: "",
      scheduledTime: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Create Campaign Dialog */}
      <CampaignsHeader
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
      >
        <NewCampaignDialog
          newCampaign={newCampaign}
          setNewCampaign={setNewCampaign}
          onCreateCampaign={handleCreateCampaign}
          onCancel={handleCancelCreate}
          isLoading={isLoading}
        />
      </CampaignsHeader>

      {/* Stats Cards */}
      <CampaignStatsCards campaigns={mockCampaigns} />

      {/* Filters */}
      <CampaignFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Campaigns Grid */}
      <CampaignsGrid campaigns={filteredCampaigns} />
    </div>
  );
};

export default AdminCampaigns;
