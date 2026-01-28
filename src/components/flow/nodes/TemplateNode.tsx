import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNodeTheme } from "@/config/nodeThemes";
import NodeActionButtons from "@/components/flow/NodeActionButtons";

const TemplateNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const templateName = (data.templateName as string) || "No template selected";
  const templateId = data.templateId as string | undefined;
  const theme = getNodeTheme("template");

  // Get delete and copy handlers from data
  const handleDelete = () => {
    if (data.onDelete && typeof data.onDelete === "function") {
      data.onDelete(id);
    }
  };

  const handleCopy = () => {
    if (data.onCopy && typeof data.onCopy === "function") {
      data.onCopy(id);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl shadow-md border-2 transition-all min-w-[250px] relative",
        selected ? "shadow-xl ring-2 ring-offset-2" : ""
      )}
      style={{
        backgroundColor: theme.background,
        borderColor: selected ? theme.accent : theme.border,
      }}
    >
      {selected && (
        <NodeActionButtons onDelete={handleDelete} onCopy={handleCopy} />
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: theme.accent }}
        className="!w-3 !h-3 !border-2 !border-white"
      />

      {/* Header */}
      <div
        className="px-4 py-2 rounded-t-xl flex items-center gap-2"
        style={{ backgroundColor: theme.headerBg, color: theme.headerText }}
      >
        <FileText className="h-4 w-4" />
        <span className="font-medium text-sm">
          {(data.label as string) || "Template"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-medium">Template:</p>
          {templateId ? (
            <div
              className="px-3 py-2 border rounded"
              style={{
                backgroundColor: theme.iconBg,
                borderColor: theme.border,
              }}
            >
              <p className="text-sm font-medium text-gray-900">
                {templateName}
              </p>
              <p className="text-xs text-gray-600 mt-1">ID: {templateId}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No template selected</p>
          )}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: theme.accent }}
        className="!w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
};

export default TemplateNode;
