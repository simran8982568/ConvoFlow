import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNodeTheme } from "@/config/nodeThemes";
import NodeActionButtons from "@/components/flow/NodeActionButtons";

const MessageNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const text = (data.text as string) || "";
  // Ensure buttons is an array with a fallback to empty array
  const buttons = Array.isArray(data.buttons) ? data.buttons : [];
  const theme = getNodeTheme("message");

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
        "rounded-xl shadow-md border-2 transition-all min-w-[250px] max-w-[300px] relative",
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
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium text-sm">
          {(data.label as string) || "Text Buttons"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {text ? (
          <p className="text-sm text-gray-700 line-clamp-3">{text}</p>
        ) : (
          <p className="text-xs text-gray-400 italic">No message text</p>
        )}

        {buttons.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-600 font-medium">Buttons:</p>
            {buttons.slice(0, 3).map((button: any, idx: number) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-center"
                style={{
                  backgroundColor: theme.iconBg,
                  color: theme.accent,
                }}
              >
                {button.text}
              </div>
            ))}
            {buttons.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{buttons.length - 3} more
              </p>
            )}
          </div>
        )}
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

export default MessageNode;
