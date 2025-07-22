import React, { useState } from "react";
import { Send, Paperclip, Smile, Mic, Search } from "lucide-react";
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
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)] flex bg-white w-full">
      {/* Conversations List - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:flex w-80 border-r border-gray-200 flex-col bg-white">
        <InboxHeader />
        <div className="relative p-4 pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 rounded-full"
            />
          </div>
        </div>
        <Conversations
          selectedId={selectedConversation.id}
          setSelected={setSelectedConversation}
          searchTerm={searchTerm}
        />
      </div>
      {/* Chat Area - Full width on mobile, flex-1 on larger screens */}
      <div className="flex-1 w-full flex flex-col bg-gray-50 min-w-0">
        <ChatHeader conversation={selectedConversation} />

        {/* Messages Area with WhatsApp-style background */}
        <div
          className="flex-1 p-4 overflow-y-auto"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#f0f2f5'
          }}
        >
          <Messages messages={selectedConversation.messages} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <QuickReplies onReply={handleQuickReply} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 w-full">
          <div className="flex items-end space-x-2 sm:space-x-3 w-full">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full flex-shrink-0"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Message Input */}
            <div className="flex-1 relative min-w-0 w-full">
              <div className="flex items-end bg-white border border-gray-300 rounded-3xl px-3 sm:px-4 py-2 focus-within:border-teal-500 transition-colors w-full">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent outline-none text-sm resize-none max-h-20 py-1 min-w-0"
                  style={{ minHeight: '20px' }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-1 ml-1 sm:ml-2 flex-shrink-0"
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Send/Mic Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className={`p-2 sm:p-3 rounded-full transition-all flex-shrink-0 ${
                messageInput.trim()
                  ? "bg-teal-500 hover:bg-teal-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-500"
              }`}
            >
              {messageInput.trim() ? (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;
