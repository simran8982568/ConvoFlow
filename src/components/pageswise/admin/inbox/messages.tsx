// messages.tsx
import React from "react";

const getMessageStatusIcon = (status: string) => {
  switch (status) {
    case "sent":
      return "✓";
    case "delivered":
      return "✓✓";
    case "read":
      return "✓✓";
    default:
      return "";
  }
};

const Messages = ({ messages }: { messages: any[] }) => (
  <div className="space-y-4">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${
          message.sender === "agent" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.sender === "agent"
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div
            className={`flex items-center justify-end mt-1 space-x-1 ${
              message.sender === "agent" ? "text-teal-100" : "text-gray-500"
            }`}
          >
            <span className="text-xs">{message.timestamp}</span>
            {message.sender === "agent" && (
              <span className="text-xs">
                {getMessageStatusIcon(message.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Messages;
