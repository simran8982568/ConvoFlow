import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Mic, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockConversations } from "./mockdata";
import InboxHeader from "./header";
import ChatHeader from "./chatheader";
import Conversations from "./conversations";
import Messages from "./messages";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary";
import { LoadingSpinner, InlineLoading } from "@/components/common/LoadingStates";
import useAsyncOperation from "@/hooks/useAsyncOperation";
import "./inbox.css";

const AdminInbox: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add loading and error states for message sending
  const sendMessageOperation = useAsyncOperation({
    showToast: true,
    toastTitle: "Message Error",
    onSuccess: () => {
      setMessageInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setTimeout(scrollToBottom, 100);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    // Simulate API call for sending message
    await sendMessageOperation.execute(async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate potential error (uncomment to test error handling)
      // if (Math.random() > 0.8) {
      //   throw new Error('Failed to send message. Please try again.');
      // }

      // TODO: Replace with actual API call
      console.log('Message sent:', messageInput);

      return { success: true };
    });
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-white w-full overflow-hidden">
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
        <div className="flex-1 overflow-hidden">
          <Conversations
            selectedId={selectedConversation.id}
            setSelected={setSelectedConversation}
            searchTerm={searchTerm}
          />
        </div>
      </div>
      {/* Chat Area - Full width on mobile, flex-1 on larger screens */}
      <div className="flex-1 w-full flex flex-col bg-gray-50 min-w-0 overflow-hidden">
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
          <div ref={messagesEndRef} />
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
                <Textarea
                  ref={textareaRef}
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent outline-none text-sm resize-none border-none p-0 min-h-[20px] max-h-[120px] leading-5 focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{
                    minHeight: '20px',
                    height: 'auto',
                    overflow: 'hidden'
                  }}
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
              disabled={!messageInput.trim() || sendMessageOperation.loading}
              className={`p-2 sm:p-3 rounded-full transition-all flex-shrink-0 ${
                messageInput.trim() && !sendMessageOperation.loading
                  ? "bg-teal-500 hover:bg-teal-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-500"
              }`}
            >
              {sendMessageOperation.loading ? (
                <LoadingSpinner size="sm" />
              ) : messageInput.trim() ? (
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
