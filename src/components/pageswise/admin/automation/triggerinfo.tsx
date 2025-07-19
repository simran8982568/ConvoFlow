// triggerinfo.tsx
import React from "react";
import { Zap } from "lucide-react";

interface TriggerInfoProps {
  trigger: string;
  createdAt: string;
}

const TriggerInfo: React.FC<TriggerInfoProps> = ({ trigger, createdAt }) => (
  <div className="flex items-center justify-between text-sm text-gray-500">
    <span className="flex items-center gap-1">
      <Zap className="w-4 h-4" />
      Trigger: {trigger}
    </span>
    <span>Created: {createdAt}</span>
  </div>
);

export default TriggerInfo;
