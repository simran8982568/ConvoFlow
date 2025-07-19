// actionbuttons.tsx

import type { Workflow } from "./types";
import { Button } from "@/components/ui/button";
import { Edit, Pause, Play, BarChart3 } from "lucide-react";

interface ActionButtonsProps {
  workflow: Workflow;
  onEdit: (workflow: Workflow) => void;
  onAction: (action: string, workflowId: number) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  workflow,
  onEdit,
  onAction,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(workflow)}
        className="flex-1"
      >
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>
      {workflow.status === "Active" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction("Pause", workflow.id)}
        >
          <Pause className="w-4 h-4 mr-1" />
          Pause
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction("Activate", workflow.id)}
        >
          <Play className="w-4 h-4 mr-1" />
          Start
        </Button>
      )}
      <Button variant="outline" size="sm">
        <BarChart3 className="w-4 h-4 mr-1" />
        Analytics
      </Button>
    </div>
  );
};

export default ActionButtons;
