import React from "react";
import {
  Play,
  MessageSquare,
  Image,
  FileText,
  List,
  HelpCircle,
  Settings,
  Tag,
  Globe,
} from "lucide-react";
import { getNodeTheme } from "@/config/nodeThemes";
import TemplateSelection from "./TemplateSelection";

interface NodeType {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const nodeTypes: NodeType[] = [
  {
    type: "flowStart",
    label: "Flow Start",
    icon: Play,
    description: "Entry point with triggers",
  },
  {
    type: "message",
    label: "Text Buttons",
    icon: MessageSquare,
    description: "Send text with buttons",
  },
  {
    type: "mediaButtons",
    label: "Media + Buttons",
    icon: Image,
    description: "Send media with buttons",
  },
  {
    type: "list",
    label: "List Message",
    icon: List,
    description: "Interactive list picker",
  },
  {
    type: "askQuestion",
    label: "Ask Question",
    icon: HelpCircle,
    description: "Capture user input",
  },
  {
    type: "template",
    label: "Template",
    icon: FileText,
    description: "WhatsApp template",
  },
  {
    type: "setAttribute",
    label: "Set Attribute",
    icon: Settings,
    description: "Store session data",
  },
  { type: "addTag", label: "Add Tag", icon: Tag, description: "Tag contacts" },
  {
    type: "apiRequest",
    label: "API Request",
    icon: Globe,
    description: "External API call",
  },
];

const SidebarNodes: React.FC = () => {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    template?: any
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    if (template) {
      event.dataTransfer.setData("template/data", JSON.stringify(template));
    }
    event.dataTransfer.effectAllowed = "move";
  };

  const onAddTemplateNode = (template: any) => {
    // This would be handled by the parent component in a real implementation
    console.log("Add template node:", template);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Nodes</h3>
        <p className="text-xs text-gray-600">Drag and drop to canvas</p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((node) => {
          const theme = getNodeTheme(node.type);
          const IconComponent = node.icon;
          return (
            <div
              key={node.type}
              className="group rounded-xl border-2 cursor-move transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
              }}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              <div className="flex items-center gap-3 p-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.iconBg, color: theme.accent }}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {node.label}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {node.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-6">
        <TemplateSelection
          onAddTemplateNode={onAddTemplateNode}
          onDragStart={onDragStart}
        />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Drag nodes onto the canvas to build your
          automation flow. Connect them by dragging from one node's handle to
          another.
        </p>
      </div>
    </div>
  );
};

export default SidebarNodes;
