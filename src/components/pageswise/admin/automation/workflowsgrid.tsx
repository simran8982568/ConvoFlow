// workflowsgrid.tsx

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Edit } from "lucide-react";
import ActionButtons from "./actionbuttons";
import TriggerInfo from "./triggerinfo";
import type { Workflow } from "./types";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-green-100 text-green-800">
          <Play className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case "Paused":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Pause className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      );
    case "Draft":
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <Edit className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

type WorkflowsGridProps = {
  workflows: Workflow[];
};

const WorkflowsGrid: React.FC<WorkflowsGridProps> = ({ workflows }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [pausedWorkflows, setPausedWorkflows] = useState<Set<number>>(new Set());

  const handleWorkflowAction = (action: string, workflowId: number) => {
    // You can add toast or logic here if needed
    // For now, just a placeholder
    // toast({ ... })
  };

  const handlePauseToggle = (workflowId: number, isPaused: boolean) => {
    setPausedWorkflows(prev => {
      const newSet = new Set(prev);
      if (isPaused) {
        newSet.add(workflowId);
      } else {
        newSet.delete(workflowId);
      }
      return newSet;
    });
  };

  const openWorkflowBuilder = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsBuilderOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {workflows.map((workflow) => {
        const isPaused = pausedWorkflows.has(workflow.id);
        return (
          <Card
            key={workflow.id}
            className={`hover:shadow-lg transition-all duration-300 ${
              isPaused ? 'bg-red-50 border-red-200' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className={`text-lg flex items-center gap-2 ${
                    isPaused ? 'text-red-700' : ''
                  }`}>
                    {workflow.name}
                    {isPaused && <span className="text-sm font-normal text-red-600">(Paused)</span>}
                  </CardTitle>
                  <CardDescription className={`mt-1 ${isPaused ? 'text-red-600' : ''}`}>
                    {workflow.description}
                  </CardDescription>
                </div>
                {getStatusBadge(workflow.status)}
              </div>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Workflow Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">
                    {workflow.totalRuns}
                  </p>
                  <p className="text-sm text-gray-600">Total Runs</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">
                    {workflow.completionRate}%
                  </p>
                  <p className="text-sm text-gray-600">Completion</p>
                </div>
              </div>

              {/* Trigger Info */}
              <TriggerInfo
                trigger={workflow.trigger}
                createdAt={workflow.createdAt}
              />

              {/* Action Buttons */}
              <ActionButtons
                workflow={workflow}
                onEdit={openWorkflowBuilder}
                onAction={handleWorkflowAction}
                isPaused={isPaused}
                onPauseToggle={handlePauseToggle}
              />
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
};

export default WorkflowsGrid;
