// actionbuttons.tsx

import React, { useState } from "react";
import type { Workflow } from "./types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Pause, Play, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import AutomationEditModal from "./AutomationEditModal";
import AutomationAnalyticsChart from "./AutomationAnalyticsChart";

interface ActionButtonsProps {
  workflow: Workflow;
  onEdit: (workflow: Workflow) => void;
  onAction: (action: string, workflowId: number) => void;
  isPaused?: boolean;
  onPauseToggle?: (workflowId: number, isPaused: boolean) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  workflow,
  onEdit,
  onAction,
  isPaused = false,
  onPauseToggle,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handlePauseClick = () => {
    const newPausedState = !isPaused;
    onPauseToggle?.(workflow.id, newPausedState);
    onAction(newPausedState ? "Pause" : "Activate", workflow.id);
  };

  const handleAnalyticsClick = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditClick}
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePauseClick}
          className={isPaused ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : ""}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 mr-1" />
              Start
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </>
          )}
        </Button>

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
      </div>

      {/* Analytics Chart - Slides down when toggled */}
      {showAnalytics && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
          <AutomationAnalyticsChart workflow={workflow} />
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Automation Workflow</DialogTitle>
            <DialogDescription>
              Update your automation workflow settings and flow.
            </DialogDescription>
          </DialogHeader>
          <AutomationEditModal
            workflow={workflow}
            onClose={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionButtons;
