import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNodeTheme } from "@/config/nodeThemes";
import NodeActionButtons from "@/components/flow/NodeActionButtons";

const SetAttributeNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const attributeName = (data.attributeName as string) || "";
  const attributeValue = (data.attributeValue as string) || "";
  const theme = getNodeTheme("setAttribute");

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
        <Settings className="h-4 w-4" />
        <span className="font-medium text-sm">
          {(data.label as string) || "Set Attribute"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          {attributeName && attributeValue ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Attribute:</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {attributeName}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded truncate max-w-[150px]">
                  {attributeValue}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No attribute configured
            </p>
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

export default SetAttributeNode;
