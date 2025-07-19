// types.ts
export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
}

export interface Workflow {
  id: number;
  name: string;
  description: string;
  status: string;
  trigger: string;
  totalRuns: number;
  completionRate: number;
  createdAt: string;
  nodes: WorkflowNode[];
}
