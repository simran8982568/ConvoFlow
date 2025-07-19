// Action buttons component for phone number operations

import React from "react";
import { TestTube, Settings, Trash2, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneNumber } from "./mockdata";
import { useConnectionTest } from "./connectiontest";
import { useToast } from "@/hooks/use-toast";

interface PhoneNumberActionButtonsProps {
  phoneNumber: PhoneNumber;
  onRefresh?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewConfig?: (id: number) => void;
  onViewLogs?: (id: number) => void;
}

const PhoneNumberActionButtons: React.FC<PhoneNumberActionButtonsProps> = ({
  phoneNumber,
  onRefresh,
  onDelete,
  onViewConfig,
  onViewLogs,
}) => {
  const { handleTestConnection } = useConnectionTest();
  const { toast } = useToast();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh(phoneNumber.id);
    } else {
      toast({
        title: "Refreshing Data",
        description: "Phone number data is being refreshed...",
      });
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${phoneNumber.displayName}? This action cannot be undone.`
    );

    if (confirmed) {
      if (onDelete) {
        onDelete(phoneNumber.id);
      } else {
        toast({
          title: "Phone Number Removed",
          description: "Phone number has been removed successfully.",
        });
      }
    }
  };

  const handleViewConfig = () => {
    if (onViewConfig) {
      onViewConfig(phoneNumber.id);
    } else {
      toast({
        title: "Configuration",
        description: "Configuration view will be implemented soon.",
      });
    }
  };

  const handleViewLogs = () => {
    if (onViewLogs) {
      onViewLogs(phoneNumber.id);
    } else {
      toast({
        title: "Webhook Logs",
        description: "Webhook logs view will be implemented soon.",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Test Connection Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleTestConnection(phoneNumber)}
        disabled={phoneNumber.status === "Pending"}
      >
        <TestTube className="w-4 h-4 mr-1" />
        Test Connection
      </Button>

      {/* Refresh Button */}
      <Button variant="outline" size="sm" onClick={handleRefresh}>
        <RefreshCw className="w-4 h-4 mr-1" />
        Refresh
      </Button>

      {/* View Configuration Button */}
      <Button variant="outline" size="sm" onClick={handleViewConfig}>
        <Settings className="w-4 h-4 mr-1" />
        Config
      </Button>

      {/* View Logs Button */}
      <Button variant="outline" size="sm" onClick={handleViewLogs}>
        <Activity className="w-4 h-4 mr-1" />
        Logs
      </Button>

      {/* Delete Button */}
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:border-red-300"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Remove
      </Button>
    </div>
  );
};

export default PhoneNumberActionButtons;
