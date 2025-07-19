import React, { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockConversations } from "./mockdata";
import InboxHeader from "./header";
import ChatHeader from "./chatheader";
import Conversations from "./conversations";
import Messages from "./messages";
import QuickReplies from "./quickreplies";

const AdminInbox: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Implement send message functionality
      setMessageInput("");
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessageInput(reply);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <InboxHeader />
        <div className="relative p-4 pt-0">
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Conversations
          selectedId={selectedConversation.id}
          setSelected={setSelectedConversation}
          searchTerm={searchTerm}
        />
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader conversation={selectedConversation} />
        <ScrollArea className="flex-1 p-4">
          <Messages messages={selectedConversation.messages} />
        </ScrollArea>
        <div className="px-4 py-2 border-t border-gray-100">
          <QuickReplies onReply={handleQuickReply} />
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;
