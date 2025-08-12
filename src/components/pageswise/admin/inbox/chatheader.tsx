import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, ArrowLeft } from "lucide-react";

const getStatusColor = (status: string) => {
  return status === "online" ? "bg-green-500" : "bg-gray-400";
};

interface ChatHeaderProps {
  conversation: any;
  onToggleMobileConversations?: () => void;
  onCloseChat?: () => void;
  showBackButton?: boolean;
  showCloseButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onToggleMobileConversations,
  onCloseChat,
  showBackButton = false,
  showCloseButton = false,
}) => {
  return (
    <div className="w-full p-4 border-b border-gray-200 flex items-center justify-between bg-white">
      {/* Left Side: Back Button + Avatar + Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 flex-shrink-0 hover:bg-gray-100"
            onClick={onToggleMobileConversations}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        )}

        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10">
            <AvatarImage src={conversation.contact.avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {conversation.contact.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
              conversation.contact.status
            )}`}
          />
        </div>

        <div className="flex-1 min-w-0 pl-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {conversation.contact.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {conversation.contact.phone}
          </p>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Phone className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Video className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
