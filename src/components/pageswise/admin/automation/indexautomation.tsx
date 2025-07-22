import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockWorkflows } from "./mockdata";
import HeaderCards from "./headercards";
import WorkflowsGrid from "./workflowsgrid";
import CampaignSelectionModal from "./CampaignSelectionModal";
import TriggerInfo from "./triggerinfo";

// ActionButtons is used inside WorkflowsGrid

const AdminAutomation: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCampaignSelectionOpen, setIsCampaignSelectionOpen] = useState(false);
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const { toast } = useToast();
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "",
    selectedCampaign: null as any,
  });

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description || !newWorkflow.trigger) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create new workflow object
    const newWorkflowObj = {
      id: Date.now(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: "Draft",
      trigger: newWorkflow.trigger,
      totalRuns: 0,
      completionRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      nodes: [
        {
          id: "start",
          type: "trigger",
          label: newWorkflow.trigger,
          x: 100,
          y: 100,
        },
      ],
    };

    // Add to workflows list
    setWorkflows(prev => [...prev, newWorkflowObj]);

    toast({
      title: "Workflow Created",
      description: `"${newWorkflow.name}" has been created successfully.`,
    });
    setIsCreateDialogOpen(false);
    setNewWorkflow({ name: "", description: "", trigger: "", selectedCampaign: null });
  };

  const handleCampaignSelection = (campaign: any) => {
    setNewWorkflow({ ...newWorkflow, selectedCampaign: campaign });
    setIsCampaignSelectionOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1">
            Create and manage automated WhatsApp workflows
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Set up a new automation workflow for your WhatsApp campaigns
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={newWorkflow.name}
                  onChange={(e) =>
                    setNewWorkflow({ ...newWorkflow, name: e.target.value })
                  }
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newWorkflow.description}
                  onChange={(e) =>
                    setNewWorkflow({
                      ...newWorkflow,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what this workflow does"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="trigger">Trigger Event</Label>
                <Select
                  value={newWorkflow.trigger}
                  onValueChange={(value) =>
                    setNewWorkflow({ ...newWorkflow, trigger: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Contact Added">
                      New Contact Added
                    </SelectItem>
                    <SelectItem value="Tag Added">Tag Added</SelectItem>
                    <SelectItem value="Cart Abandoned">
                      Cart Abandoned
                    </SelectItem>
                    <SelectItem value="Birthday Date">Birthday Date</SelectItem>
                    <SelectItem value="Purchase Made">Purchase Made</SelectItem>
                    <SelectItem value="Form Submitted">
                      Form Submitted
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Campaign Selection</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCampaignSelectionOpen(true)}
                    className="flex-1"
                  >
                    {newWorkflow.selectedCampaign
                      ? `Selected: ${newWorkflow.selectedCampaign.name}`
                      : "Select Campaign"
                    }
                  </Button>
                  {newWorkflow.selectedCampaign && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewWorkflow({ ...newWorkflow, selectedCampaign: null })}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWorkflow}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Create Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <HeaderCards workflows={workflows} />

      {/* Workflows Grid */}
      <WorkflowsGrid workflows={workflows} />

      {/* Campaign Selection Modal */}
      <CampaignSelectionModal
        isOpen={isCampaignSelectionOpen}
        onClose={() => setIsCampaignSelectionOpen(false)}
        onSelectCampaign={handleCampaignSelection}
      />
    </div>
  );
};

export default AdminAutomation;
