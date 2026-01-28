import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNodeTheme } from "@/config/nodeThemes";
import NodeActionButtons from "@/components/flow/NodeActionButtons";

const AddTagNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const tagName = (data.tagName as string) || "";
  const theme = getNodeTheme("addTag");

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
        <Tag className="h-4 w-4" />
        <span className="font-medium text-sm">
          {(data.label as string) || "Add Tag"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-medium">Tag to add:</p>
          {tagName ? (
            <div
              className="px-3 py-2 rounded inline-flex items-center gap-2"
              style={{ backgroundColor: theme.iconBg, color: theme.accent }}
            >
              <Tag className="h-3 w-3" />
              <span className="text-sm font-medium">{tagName}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No tag selected</p>
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

export default AddTagNode;
