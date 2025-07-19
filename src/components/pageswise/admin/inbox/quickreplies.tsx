// quickreplies.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { quickReplies } from "./mockdata";

const QuickReplies = ({ onReply }: { onReply: (reply: string) => void }) => (
  <div className="flex space-x-2 overflow-x-auto">
    {quickReplies.map((reply, index) => (
      <Button
        key={index}
        variant="outline"
        size="sm"
        onClick={() => onReply(reply)}
        className="whitespace-nowrap"
      >
        {reply}
      </Button>
    ))}
  </div>
);

export default QuickReplies;
