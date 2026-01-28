import React from "react";
import { Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeActionButtonsProps {
  onDelete: () => void;
  onCopy: () => void;
  className?: string;
}

const NodeActionButtons: React.FC<NodeActionButtonsProps> = ({
  onDelete,
  onCopy,
  className = "",
}) => {
  return (
    <div className={`absolute top-2 right-2 flex gap-1 z-10 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 bg-white hover:bg-red-50 border-gray-300 shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3 text-red-500" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 bg-white hover:bg-blue-50 border-gray-300 shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
      >
        <Copy className="h-3 w-3 text-blue-500" />
      </Button>
    </div>
  );
};

export default NodeActionButtons;
