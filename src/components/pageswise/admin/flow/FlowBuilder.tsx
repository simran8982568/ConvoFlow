import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Panel,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useToast } from "@/hooks/use-toast";
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

// Import services
import {
  getFlow,
  updateFlow,
  exportFlowAsJSON,
  importFlowFromJSON,
} from "@/service/api/flows";
import {
  validateFlow,
  generateNodeId,
  generateEdgeId,
  autoLayoutNodes,
} from "@/utils/flowUtils";
import { FlowSimulator } from "@/service/flowEngine";

// Import components
import Toolbar from "@/components/flow/Toolbar";
import SidebarNodes from "@/components/flow/SidebarNodes";
import NodeConfigPanel from "@/components/flow/NodeConfigPanel";
import SimulatorDrawer from "@/components/flow/SimulatorDrawer";
import ValidationPanel from "@/components/flow/ValidationPanel";

// Import node components
import FlowStartNode from "@/components/flow/nodes/FlowStartNode";
import MessageNode from "@/components/flow/nodes/MessageNode";
import MediaButtonsNode from "@/components/flow/nodes/MediaButtonsNode";
import TemplateNode from "@/components/flow/nodes/TemplateNode";
import ListNode from "@/components/flow/nodes/ListNode";
import AskQuestionNode from "@/components/flow/nodes/AskQuestionNode";
import SetAttributeNode from "@/components/flow/nodes/SetAttributeNode";
import AddTagNode from "@/components/flow/nodes/AddTagNode";
import ApiRequestNode from "@/components/flow/nodes/ApiRequestNode";

// Import node wrappers
import {
  FlowStartNodeWrapper,
  MessageNodeWrapper,
  MediaButtonsNodeWrapper,
  TemplateNodeWrapper,
  ListNodeWrapper,
  AskQuestionNodeWrapper,
  SetAttributeNodeWrapper,
  AddTagNodeWrapper,
  ApiRequestNodeWrapper,
} from "@/components/flow/NodeWrappers";

// Import edge components

const FlowBuilderContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Flow state
  const [flowName, setFlowName] = useState("New Flow");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Selected node for config panel
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [simulator, setSimulator] = useState<FlowSimulator | null>(null);
  const [simulationMessages, setSimulationMessages] = useState<any[]>([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);

  // Validation panel
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  // History for undo/redo (up to 100 states)
  const [history, setHistory] = useState<
    Array<{ nodes: Node[]; edges: Edge[] }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const MAX_HISTORY = 100;
  // Clear confirmation dialog state
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  // Load flow data when component mounts
  useEffect(() => {
    const loadFlow = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const flowData = await getFlow(id);
        setFlowName(flowData.name);
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);

        // Initialize history with loaded data
        pushToHistory(flowData.nodes || [], flowData.edges || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load flow",
          variant: "destructive",
        });
        navigate("/admin/flows");
      } finally {
        setIsLoading(false);
      }
    };

    loadFlow();
  }, [id]);

  // Initialize history
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      pushToHistory(nodes, edges);
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (id && nodes.length > 0) {
        handleSave(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [id, nodes, edges, flowName]);

  // Update selected node when nodes change
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find((n) => n.id === selectedNode.id);
      if (updatedNode) {
        setSelectedNode(updatedNode);
      }
    }
  }, [nodes]);

  // History management (up to 100 states)
  const pushToHistory = (newNodes: Node[], newEdges: Edge[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes: [...newNodes], edges: [...newEdges] });
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      } else {
        setHistoryIndex((idx) => idx + 1);
      }
      return newHistory;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex((idx) => idx - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex((idx) => idx + 1);
    }
  };

  // Handle save
  const handleSave = async (isAutoSave = false) => {
    if (!id) return;

    try {
      setIsSaving(true);
      await updateFlow(id, {
        name: flowName,
        nodes,
        edges,
      });

      if (!isAutoSave) {
        toast({
          title: "Success",
          description: "Flow saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save flow",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle validation
  const handleValidate = () => {
    const errors = validateFlow(nodes, edges);
    setValidationErrors(errors);
    setShowValidationPanel(true);

    if (errors.length === 0) {
      toast({
        title: "Validation Passed",
        description: "Your flow has no errors!",
      });
    }
  };

  // Handle error click to highlight node
  const handleErrorClick = (nodeId?: string) => {
    if (nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        // Center the node in view
        reactFlowInstance?.setCenter(
          node.position.x + 150,
          node.position.y + 100,
          {
            zoom: 1.2,
            duration: 800,
          }
        );
      }
    }
  };

  // Handle simulation
  const handleSimulate = () => {
    const errors = validateFlow(nodes, edges);
    const criticalErrors = errors.filter((e) => e.type === "error");

    if (criticalErrors.length > 0) {
      toast({
        title: "Cannot Simulate",
        description: "Please fix validation errors first",
        variant: "destructive",
      });
      setValidationErrors(errors);
      setShowValidationPanel(true);
      return;
    }

    setIsSimulating(true);
    setIsSimulationStarted(false);
    setSimulationMessages([]);
  };

  const handleStartSimulation = () => {
    const sim = new FlowSimulator(nodes, edges);
    const initialState = sim.start("hi");
    setSimulator(sim);
    setSimulationMessages(initialState.messages);
    setIsWaitingForInput(initialState.isWaitingForInput);
    setIsSimulationStarted(true);

    toast({
      title: "Simulation Started",
      description: "Interact with the chat interface",
    });
  };

  const handleSendMessage = (message: string) => {
    if (!simulator) return;
    const newState = simulator.handleUserInput(message, "text");
    setSimulationMessages(newState.messages);
    setIsWaitingForInput(newState.isWaitingForInput);

    if (newState.isComplete) {
      toast({
        title: "Simulation Complete",
        description: "Flow execution finished",
      });
    }
  };

  const handleButtonClick = (buttonText: string) => {
    if (!simulator) return;
    const newState = simulator.handleUserInput(buttonText, "button");
    setSimulationMessages(newState.messages);
    setIsWaitingForInput(newState.isWaitingForInput);

    if (newState.isComplete) {
      toast({
        title: "Simulation Complete",
        description: "Flow execution finished",
      });
    }
  };

  const handleListItemClick = (itemTitle: string) => {
    if (!simulator) return;
    const newState = simulator.handleUserInput(itemTitle, "list");
    setSimulationMessages(newState.messages);
    setIsWaitingForInput(newState.isWaitingForInput);

    if (newState.isComplete) {
      toast({
        title: "Simulation Complete",
        description: "Flow execution finished",
      });
    }
  };

  const handleCloseSimulation = () => {
    setIsSimulating(false);
    setIsSimulationStarted(false);
    setSimulator(null);
    setSimulationMessages([]);
    setIsWaitingForInput(false);
  };

  // Handle import
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const flowData = await importFlowFromJSON(file);
        setFlowName(flowData.name);
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);
        toast({
          title: "Success",
          description: "Flow imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import flow",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  // Handle export
  const handleExport = () => {
    if (!id) return;
    exportFlowAsJSON({
      id,
      name: flowName,
      nodes,
      edges,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast({
      title: "Success",
      description: "Flow exported successfully",
    });
  };

  // Handle clear (open confirm dialog)
  const handleClear = () => {
    setIsClearDialogOpen(true);
  };

  const confirmClear = () => {
    setNodes([]);
    setEdges([]);
    setIsClearDialogOpen(false);
    toast({
      title: "Canvas Cleared",
      description: "All nodes and connections removed",
    });
  };

  // Handle zoom
  const handleZoomIn = () => {
    reactFlowInstance?.zoomIn();
  };

  const handleZoomOut = () => {
    reactFlowInstance?.zoomOut();
  };

  // Handle edge connection
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: generateEdgeId(params.source!, params.target!),
        type: "default",
        animated: true,
      };
      setEdges((eds) => {
        const updated = addEdge(newEdge, eds);
        pushToHistory(nodes, updated);
        return updated;
      });
    },
    [setEdges, nodes]
  );

  // Define edge types as default without conditional logic
  const edgeTypes = {};

  // Handle drag and drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle node deletion
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      // Remove any edges connected to this node
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      // Close the config panel if the deleted node was selected
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode(null);
      }
      // Add to history
      pushToHistory(
        nodes.filter((node) => node.id !== nodeId),
        edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      toast({
        title: "Success",
        description: "Node deleted successfully",
      });
    },
    [
      nodes,
      edges,
      setNodes,
      setEdges,
      setSelectedNode,
      selectedNode,
      pushToHistory,
      toast,
    ]
  );

  // Handle node duplication
  const handleCopyNode = useCallback(
    (nodeId: string) => {
      const nodeToCopy = nodes.find((node) => node.id === nodeId);
      if (!nodeToCopy) return;

      // Create a new node with copied data
      const newNode: Node = {
        ...nodeToCopy,
        id: generateNodeId(nodeToCopy.type || "message"),
        position: {
          x: nodeToCopy.position.x + 40,
          y: nodeToCopy.position.y + 40,
        },
        selected: true,
      };

      // Add the new node
      setNodes((nds) => {
        const updated = nds
          .map((n) => ({ ...n, selected: false }))
          .concat(newNode);
        pushToHistory(updated, edges);
        return updated;
      });

      // Select the new node
      setSelectedNode(newNode);

      toast({
        title: "Success",
        description: "Node duplicated successfully",
      });
    },
    [
      nodes,
      edges,
      setNodes,
      setSelectedNode,
      pushToHistory,
      generateNodeId,
      toast,
    ]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowWrapper.current || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      // Check if we have template data
      let newNodeData: any = {
        label:
          type.charAt(0).toUpperCase() +
          type.slice(1).replace(/([A-Z])/g, " $1"),
        // Add default empty arrays for all node types
        options: [],
        buttons: [],
        inputFields: [],
        quickReplies: [],
        items: [],
        triggers: [],
        // Pass delete and copy handlers through data
        onDelete: handleDeleteNode,
        onCopy: handleCopyNode,
      };

      if (type === "template") {
        const templateData = event.dataTransfer.getData("template/data");
        if (templateData) {
          try {
            const template = JSON.parse(templateData);
            newNodeData = {
              ...newNodeData,
              templateId: template.id,
              templateName: template.name,
              text:
                template.components.length > 0
                  ? template.components[0].text
                  : "",
            };
          } catch (e) {
            console.error("Failed to parse template data", e);
          }
        }
      }

      const newNode: Node = {
        id: generateNodeId(type),
        type,
        position,
        data: newNodeData,
        selected: true,
      };

      setNodes((nds) => {
        const updated = nds
          .map((n) => ({ ...n, selected: false }))
          .concat(newNode);
        pushToHistory(updated, edges);
        return updated;
      });

      // Auto-select, open config panel, and scroll to node
      setTimeout(() => {
        setSelectedNode(newNode);
        if (reactFlowInstance) {
          reactFlowInstance.setCenter(
            newNode.position.x + 150,
            newNode.position.y + 100,
            {
              zoom: 1,
              duration: 500,
            }
          );
        }
      }, 100);
    },
    [reactFlowInstance, setNodes, edges, handleDeleteNode, handleCopyNode]
  );

  // Define node types after handleDeleteNode and handleCopyNode are defined
  const nodeTypes = {
    flowStart: (props: any) => (
      <FlowStartNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    message: (props: any) => (
      <MessageNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    mediaButtons: (props: any) => (
      <MediaButtonsNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    template: (props: any) => (
      <TemplateNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    list: (props: any) => (
      <ListNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    askQuestion: (props: any) => (
      <AskQuestionNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    setAttribute: (props: any) => (
      <SetAttributeNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    addTag: (props: any) => (
      <AddTagNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
    apiRequest: (props: any) => (
      <ApiRequestNodeWrapper
        {...props}
        data={{
          ...props.data,
          onDelete: handleDeleteNode,
          onCopy: handleCopyNode,
        }}
      />
    ),
  };

  // Handle node selection
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);

      // Smooth scroll to the node in the canvas
      if (reactFlowInstance) {
        reactFlowInstance.setCenter(
          node.position.x + 100,
          node.position.y + 100,
          {
            zoom: 1,
            duration: 500,
          }
        );
      }
    },
    [reactFlowInstance]
  );

  // Handle node update from config panel
  const handleUpdateNode = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
                // Preserve the delete and copy handlers
                onDelete: handleDeleteNode,
                onCopy: handleCopyNode,
              },
            };
          }
          return node;
        })
      );
      pushToHistory(nodes, edges);
    },
    [nodes, edges, setNodes, handleDeleteNode, handleCopyNode]
  );

  // Custom nodes change handler
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Ensure all nodes have the onDelete and onCopy handlers in their data
      const updatedChanges = changes.map((change) => {
        if (change.type === "add" && "item" in change) {
          return {
            ...change,
            item: {
              ...change.item,
              data: {
                ...change.item.data,
                onDelete: handleDeleteNode,
                onCopy: handleCopyNode,
              },
            },
          };
        }
        if (change.type === "replace" && "item" in change) {
          return {
            ...change,
            item: {
              ...change.item,
              data: {
                ...change.item.data,
                onDelete: handleDeleteNode,
                onCopy: handleCopyNode,
              },
            },
          };
        }
        return change;
      });

      onNodesChange(updatedChanges);

      // Push to history on significant changes
      const significantChange = updatedChanges.some(
        (change) => change.type === "remove" || change.type === "add"
      );
      if (significantChange) {
        setTimeout(() => pushToHistory(nodes, edges), 100);
      }
    },
    [onNodesChange, nodes, edges, handleDeleteNode, handleCopyNode]
  );

  // Custom edges change handler
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      const significantChange = changes.some(
        (change) => change.type === "remove" || change.type === "add"
      );
      if (significantChange) {
        setTimeout(() => pushToHistory(nodes, edges), 100);
      }
    },
    [onEdgesChange, nodes, edges]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <Toolbar
        flowName={flowName}
        onFlowNameChange={setFlowName}
        onBack={() => navigate("/admin/flows")}
        onSave={() => handleSave(false)}
        onValidate={handleValidate}
        onSimulate={handleSimulate}
        onImport={handleImport}
        onExport={handleExport}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isSaving={isSaving}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <SidebarNodes />

        <div className="flex-1 min-h-0" ref={reactFlowWrapper}>
          <ReactFlow
            className="w-full h-full"
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.1, minZoom: 0.1, maxZoom: 1.5 }}
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background
              color="#000"
              gap={16}
              size={1}
              style={{
                backgroundColor: "#FAFAFA",
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              }}
            />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const typeColorMap: Record<string, string> = {
                  flowStart: "#16a34a",
                  message: "#2563eb",
                  mediaButtons: "#0ea5e9",
                  list: "#ea580c",
                  askQuestion: "#dc2626",
                  setAttribute: "#14b8a6",
                  addTag: "#f97316",
                  apiRequest: "#9333ea",
                  template: "#6366f1",
                };
                return typeColorMap[node.type || "message"] || "#2563eb";
              }}
              className="bg-white border border-gray-200 rounded-lg"
            />
          </ReactFlow>
        </div>

        {selectedNode && !isSimulating && (
          <NodeConfigPanel
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onCopyNode={handleCopyNode}
          />
        )}
      </div>

      {/* Simulator Drawer */}
      <SimulatorDrawer
        isOpen={isSimulating}
        onClose={handleCloseSimulation}
        messages={simulationMessages}
        isWaitingForInput={isWaitingForInput}
        isSimulationStarted={isSimulationStarted}
        onStartSimulation={handleStartSimulation}
        onSendMessage={handleSendMessage}
        onButtonClick={handleButtonClick}
        onListItemClick={handleListItemClick}
      />

      {/* Validation Panel */}
      <ValidationPanel
        isOpen={showValidationPanel}
        onClose={() => setShowValidationPanel(false)}
        errors={validationErrors}
        onErrorClick={handleErrorClick}
      />

      {/* Clear confirmation dialog - centered */}
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent className="text-center">
          <AlertDialogHeader className="text-center sm:text-center">
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear the entire canvas. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center sm:justify-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClear}>
              Clear Canvas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const FlowBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowBuilderContent />
    </ReactFlowProvider>
  );
};

export default FlowBuilder;
