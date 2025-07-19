// chatheader.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, MoreVertical, Star, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusColor = (status: string) => {
  return status === "online" ? "bg-green-500" : "bg-gray-400";
};

const ChatHeader = ({ conversation }: { conversation: any }) => (
  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
    <div className="flex items-center space-x-3">
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
      <div>
        <h3 className="font-medium text-gray-900">
          {conversation.contact.name}
        </h3>
        <p className="text-sm text-gray-500">{conversation.contact.phone}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm">
        <Phone className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Video className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Info className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Star className="w-4 h-4 mr-2" />
            {conversation.isStarred ? "Unstar" : "Star"} Conversation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

export default ChatHeader;
