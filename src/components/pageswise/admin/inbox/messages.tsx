import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

const getMessageStatusIcon = (status: string) => {
  switch (status) {
    case "sent":
      return <Check className="w-3 h-3" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3" />;
    case "read":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    default:
      return null;
  }
};

const Messages = ({ messages }: { messages: any[] }) => (
  <div className="messages-container space-y-3 pb-4">
    {messages.map((message, index) => {
      const isAgent = message.sender === "agent";
      const showAvatar =
        !isAgent &&
        (index === 0 || messages[index - 1]?.sender !== message.sender);

      return (
        <div
          key={message.id}
          className={`flex items-end space-x-2 ${
            isAgent ? "justify-end" : "justify-start"
          }`}
        >
          {/* Customer Avatar */}
          {!isAgent && (
            <div className="w-8 h-8 mb-1">
              {showAvatar ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback className="text-xs bg-gray-300">
                    {message.senderName?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8" /> // Spacer for alignment
              )}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`message-bubble max-w-xs sm:max-w-sm lg:max-w-md px-3 py-2 rounded-2xl relative ${
              isAgent
                ? "bg-teal-500 text-white rounded-br-md"
                : "bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm"
            }`}
          >
            {/* Message Content */}
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>

            {/* Timestamp and Status */}
            <div
              className={`flex items-center justify-end mt-1 space-x-1 ${
                isAgent ? "text-teal-100" : "text-gray-500"
              }`}
            >
              <span className="text-xs opacity-75">{message.timestamp}</span>
              {isAgent && (
                <div className="text-xs opacity-75">
                  {getMessageStatusIcon(message.status)}
                </div>
              )}
            </div>

            {/* Message Tail */}
            <div
              className={`absolute bottom-0 w-3 h-3 ${
                isAgent
                  ? "right-0 transform translate-x-1 bg-teal-500"
                  : "left-0 transform -translate-x-1 bg-white border-l border-b border-gray-200"
              }`}
              style={{
                clipPath: isAgent
                  ? "polygon(0 0, 100% 100%, 0 100%)"
                  : "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            />
          </div>

          {/* Agent Avatar Spacer */}
          {isAgent && <div className="w-8 h-8" />}
        </div>
      );
    })}
  </div>
);

export default Messages; // mockdata.tsx
