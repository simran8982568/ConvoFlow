// conversations.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { mockConversations } from "./mockdata";

const getStatusColor = (status: string) => {
  return status === "online" ? "bg-green-500" : "bg-gray-400";
};

const Conversations = ({
  selectedId,
  setSelected,
  searchTerm,
}: {
  selectedId: number;
  setSelected: (c: any) => void;
  searchTerm: string;
}) => {
  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contact.phone.includes(searchTerm) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelected(conversation)}
            className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
              selectedId === conversation.id
                ? "bg-teal-50 border border-teal-200"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation.contact.avatar} />
                  <AvatarFallback>
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.contact.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    {conversation.isStarred && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Conversations;
