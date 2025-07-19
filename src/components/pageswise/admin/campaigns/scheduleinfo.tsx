// Schedule info component for displaying campaign timing

import React from "react";
import { Calendar } from "lucide-react";
import { Campaign } from "./mockdata";
import { formatDateTime } from "./actions";

interface ScheduleInfoProps {
  campaign: Campaign;
}

const ScheduleInfo: React.FC<ScheduleInfoProps> = ({ campaign }) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        Scheduled: {formatDateTime(campaign.scheduled)}
      </span>
      <span>Created: {campaign.createdAt}</span>
    </div>
  );
};

export default ScheduleInfo;
