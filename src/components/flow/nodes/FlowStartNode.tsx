import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNodeTheme } from "@/config/nodeThemes";
import NodeActionButtons from "@/components/flow/NodeActionButtons";

const FlowStartNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  // Ensure triggers is an array with a fallback to empty array
  const triggers = Array.isArray(data.triggers) ? data.triggers : [];
  const theme = getNodeTheme("flowStart");

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

      {/* Header */}
      <div
        className="px-4 py-2 rounded-t-xl flex items-center gap-2"
        style={{ backgroundColor: theme.headerBg, color: theme.headerText }}
      >
        <Play className="h-4 w-4" />
        <span className="font-medium text-sm">
          {(data.label as string) || "Flow Start"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-medium">Trigger Keywords:</p>
          {triggers.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {triggers.map((trigger: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: theme.iconBg,
                    color: theme.accent,
                  }}
                >
                  {trigger}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No triggers set</p>
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

export default FlowStartNode;
