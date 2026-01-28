// Flow validation and utility functions
import { Node, Edge } from "@xyflow/react";

export interface ValidationError {
  type: "error" | "warning";
  message: string;
  nodeId?: string;
}

/**
 * Validate flow structure and connections
 */
export const validateFlow = (
  nodes: Node[],
  edges: Edge[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check if flow has a start node
  const startNodes = nodes.filter((node) => node.type === "flowStart");
  if (startNodes.length === 0) {
    errors.push({
      type: "error",
      message: "Flow must have a Flow Start node",
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: "error",
      message: "Flow can only have one Flow Start node",
    });
  }

  // Check for unreachable nodes
  if (startNodes.length === 1) {
    const reachableNodes = getReachableNodes(startNodes[0].id, nodes, edges);
    const unreachableNodes = nodes.filter(
      (node) => !reachableNodes.has(node.id) && node.type !== "flowStart"
    );
    unreachableNodes.forEach((node) => {
      errors.push({
        type: "warning",
        message: `Node "${
          node.data.label || node.id
        }" is not reachable from Flow Start`,
        nodeId: node.id,
      });
    });
  }

  // Check for nodes with missing required fields
  nodes.forEach((node) => {
    const nodeErrors = validateNode(node);
    errors.push(...nodeErrors);
  });

  // Check for invalid edges
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode) {
      errors.push({
        type: "error",
        message: `Edge has invalid source node: ${edge.source}`,
      });
    }
    if (!targetNode) {
      errors.push({
        type: "error",
        message: `Edge has invalid target node: ${edge.target}`,
      });
    }
  });

  // Check for nodes with buttons/lists that have no connections
  nodes.forEach((node) => {
    if (node.type === "message" || node.type === "mediaButtons") {
      // Ensure buttons is an array
      const buttons = Array.isArray(node.data.buttons) ? node.data.buttons : [];
      if (buttons.length > 0) {
        const hasConnections = edges.some((edge) => edge.source === node.id);
        if (!hasConnections) {
          errors.push({
            type: "warning",
            message: `Node "${
              node.data.label || node.id
            }" has buttons but no outgoing connections`,
            nodeId: node.id,
          });
        }
      }
    }
    if (node.type === "list") {
      // Ensure items is an array
      const items = Array.isArray(node.data.items) ? node.data.items : [];
      if (items.length > 0) {
        const hasConnections = edges.some((edge) => edge.source === node.id);
        if (!hasConnections) {
          errors.push({
            type: "warning",
            message: `Node "${
              node.data.label || node.id
            }" has list items but no outgoing connections`,
            nodeId: node.id,
          });
        }
      }
    }
  });

  return errors;
};

/**
 * Validate individual node data
 */
const validateNode = (node: Node): ValidationError[] => {
  const errors: ValidationError[] = [];

  switch (node.type) {
    case "flowStart":
      // Ensure triggers is an array
      const triggers = Array.isArray(node.data.triggers)
        ? node.data.triggers
        : [];
      if (triggers.length === 0) {
        errors.push({
          type: "warning",
          message: `Flow Start node should have at least one trigger keyword`,
          nodeId: node.id,
        });
      }
      break;

    case "message":
      if (!node.data.text || (node.data.text as string).trim() === "") {
        errors.push({
          type: "error",
          message: `Message node "${
            node.data.label || node.id
          }" must have text content`,
          nodeId: node.id,
        });
      }
      break;

    case "mediaButtons":
      if (!node.data.mediaUrl || (node.data.mediaUrl as string).trim() === "") {
        errors.push({
          type: "error",
          message: `Media node "${
            node.data.label || node.id
          }" must have a media URL`,
          nodeId: node.id,
        });
      }
      break;

    case "template":
      if (!node.data.templateId) {
        errors.push({
          type: "error",
          message: `Template node "${
            node.data.label || node.id
          }" must have a template selected`,
          nodeId: node.id,
        });
      }
      break;

    case "list":
      // Ensure items is an array
      const items = Array.isArray(node.data.items) ? node.data.items : [];
      if (items.length === 0) {
        errors.push({
          type: "error",
          message: `List node "${
            node.data.label || node.id
          }" must have at least one list item`,
          nodeId: node.id,
        });
      }
      break;

    case "askQuestion":
      if (!node.data.question || (node.data.question as string).trim() === "") {
        errors.push({
          type: "error",
          message: `Ask Question node "${
            node.data.label || node.id
          }" must have a question`,
          nodeId: node.id,
        });
      }
      if (
        !node.data.attributeName ||
        (node.data.attributeName as string).trim() === ""
      ) {
        errors.push({
          type: "error",
          message: `Ask Question node "${
            node.data.label || node.id
          }" must have an attribute name to store the answer`,
          nodeId: node.id,
        });
      }
      break;

    case "setAttribute":
      if (
        !node.data.attributeName ||
        (node.data.attributeName as string).trim() === ""
      ) {
        errors.push({
          type: "error",
          message: `Set Attribute node "${
            node.data.label || node.id
          }" must have an attribute name`,
          nodeId: node.id,
        });
      }
      if (
        !node.data.attributeValue ||
        (node.data.attributeValue as string).trim() === ""
      ) {
        errors.push({
          type: "error",
          message: `Set Attribute node "${
            node.data.label || node.id
          }" must have an attribute value`,
          nodeId: node.id,
        });
      }
      break;

    case "addTag":
      if (!node.data.tagId) {
        errors.push({
          type: "error",
          message: `Add Tag node "${
            node.data.label || node.id
          }" must have a tag selected`,
          nodeId: node.id,
        });
      }
      break;

    case "apiRequest":
      if (!node.data.url || (node.data.url as string).trim() === "") {
        errors.push({
          type: "error",
          message: `API Request node "${
            node.data.label || node.id
          }" must have a URL`,
          nodeId: node.id,
        });
      }
      if (!node.data.method) {
        errors.push({
          type: "error",
          message: `API Request node "${
            node.data.label || node.id
          }" must have an HTTP method`,
          nodeId: node.id,
        });
      }
      break;
  }

  return errors;
};

/**
 * Get all nodes reachable from a starting node
 */
const getReachableNodes = (
  startNodeId: string,
  nodes: Node[],
  edges: Edge[]
): Set<string> => {
  const reachable = new Set<string>([startNodeId]);
  const queue = [startNodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const outgoingEdges = edges.filter((edge) => edge.source === currentId);

    outgoingEdges.forEach((edge) => {
      if (!reachable.has(edge.target)) {
        reachable.add(edge.target);
        queue.push(edge.target);
      }
    });
  }

  return reachable;
};

/**
 * Auto-layout nodes in a tree structure
 */
export const autoLayoutNodes = (nodes: Node[], edges: Edge[]): Node[] => {
  // Simple tree layout algorithm
  const startNode = nodes.find((n) => n.type === "flowStart");
  if (!startNode) return nodes;

  const positioned = new Set<string>();
  const newNodes = [...nodes];
  const levels: Map<string, number> = new Map();

  // BFS to assign levels
  const queue: Array<{ id: string; level: number }> = [
    { id: startNode.id, level: 0 },
  ];
  levels.set(startNode.id, 0);

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    const children = edges.filter((e) => e.source === id).map((e) => e.target);

    children.forEach((childId) => {
      if (!levels.has(childId)) {
        levels.set(childId, level + 1);
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }

  // Position nodes based on levels
  const levelGroups: Map<number, string[]> = new Map();
  levels.forEach((level, nodeId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(nodeId);
  });

  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 200;

  levelGroups.forEach((nodeIds, level) => {
    const y = level * VERTICAL_SPACING + 100;
    const totalWidth = (nodeIds.length - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2 + 400; // Center around x=400

    nodeIds.forEach((nodeId, index) => {
      const nodeIndex = newNodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex !== -1) {
        newNodes[nodeIndex] = {
          ...newNodes[nodeIndex],
          position: {
            x: startX + index * HORIZONTAL_SPACING,
            y,
          },
        };
      }
    });
  });

  return newNodes;
};

/**
 * Generate a unique node ID
 */
export const generateNodeId = (type: string): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a unique edge ID
 */
export const generateEdgeId = (source: string, target: string): string => {
  return `e-${source}-${target}`;
};
