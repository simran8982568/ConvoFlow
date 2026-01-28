import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNodeTheme } from "@/config/nodeThemes";
import NodeActionButtons from "@/components/flow/NodeActionButtons";

const MediaButtonsNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const theme = getNodeTheme("mediaButtons");
  const text = (data.text as string) || "";
  const mediaUrl = (data.mediaUrl as string) || "";
  // Ensure buttons is an array with a fallback to empty array
  const buttons = Array.isArray(data.buttons) ? data.buttons : [];

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
        <Image className="h-4 w-4" />
        <span className="font-medium text-sm">
          {(data.label as string) || "Media + Buttons"}
        </span>
      </div>

      {/* Media Preview */}
      <div className="px-4 py-3">
        {mediaUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            {data.mediaType === "video" ? (
              <div className="bg-gray-100 aspect-video flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
            ) : (
              <div className="bg-gray-100 aspect-square flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
            )}
            <p className="text-xs text-gray-600 mt-1 truncate">
              {mediaUrl.split("/").pop()}
            </p>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">No media selected</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-3">
        {text && <p className="text-sm text-gray-700 line-clamp-2">{text}</p>}

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

export default MediaButtonsNode;
