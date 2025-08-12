import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InboxHeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({
  showBackButton = false,
  onBackClick,
}) => (
  <div className="p-4 border-b border-gray-200">
    <div className="flex items-center gap-3">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackClick}
          className="p-28 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
      )}
    
    </div>
  </div>
);

export default InboxHeader;
