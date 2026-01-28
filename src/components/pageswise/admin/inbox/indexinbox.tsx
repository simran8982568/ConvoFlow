import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockConversations } from "./mockdata";
import InboxHeader from "./header";
import ChatHeader from "./chatheader";
import Conversations from "./conversations";
import Messages from "./messages";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingStates";
import useAsyncOperation from "@/hooks/useAsyncOperation";
import "./inbox.css";

const AdminInbox: React.FC = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // for mobile menu
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageOperation = useAsyncOperation({
    showToast: true,
    toastTitle: "Message Error",
    onSuccess: () => {
      setMessageInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      setTimeout(scrollToBottom, 100);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation.messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && !event.target) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessageOperation.execute(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Message sent:", messageInput);
      return { success: true };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const commonEmojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "👎",
    "😢",
    "😮",
    "😡",
    "🎉",
    "🔥",
  ];

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleConversationSelect = (conv: any) => {
    setSelectedConversation(conv);
    setShowMobileConversations(false);
  };

  const toggleMobileConversations = () => {
    setShowMobileConversations(true);
  };

  return (
    <RouteErrorBoundary>
      <div className="w-full h-screen flex flex-col bg-white">
        {/* Mobile Layout - Show either list or chat */}
        <div className="md:hidden w-full h-full flex flex-col overflow-hidden">
          {showMobileConversations ? (
            // Mobile Conversations List View
            <div className="flex flex-col w-full h-full overflow-hidden">
              <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                <InboxHeader showBackButton={false} />
              </div>

              <div className="flex-shrink-0 p-4 bg-white">
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

              <div className="flex-1 min-h-0 overflow-y-auto">
                <Conversations
                  conversations={conversations}
                  selectedId={selectedConversation.id}
                  setSelected={handleConversationSelect}
                  searchTerm={searchTerm}
                />
              </div>
            </div>
          ) : (
            // Mobile Chat View
            <div className="flex flex-col w-full h-full overflow-hidden">
              <div className="flex-shrink-0 bg-white border-b border-gray-200">
                <ChatHeader
                  conversation={selectedConversation}
                  onToggleMobileConversations={toggleMobileConversations}
                  onCloseChat={() => setShowMobileConversations(true)}
                  showBackButton={true}
                  showCloseButton={false}
                />
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4" style={{ backgroundColor: "#f0f2f5" }}>
                <Messages messages={selectedConversation.messages} />
                <div ref={messagesEndRef} />
              </div>

              <div className="flex-shrink-0 bg-white border-t border-gray-200 p-3">
                {showEmojiPicker && (
                  <div className="mb-3 bg-white border border-gray-200 rounded-lg p-3">
                    <div className="grid grid-cols-5 gap-2">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-xl hover:bg-gray-100 rounded p-2 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full flex-shrink-0"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>

                  <div className="flex-1 relative">
                    <div className="flex items-end bg-white border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-teal-500 transition-colors">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent outline-none text-sm resize-none border-none p-0 min-h-[24px] max-h-[120px] leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEmojiClick}
                        className={`text-gray-500 hover:text-gray-700 p-1 ml-2 flex-shrink-0 ${
                          showEmojiPicker ? "bg-gray-100" : ""
                        }`}
                      >
                        <Smile className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !messageInput.trim() || sendMessageOperation.loading
                    }
                    className={`p-3 rounded-full transition-all flex-shrink-0 ${
                      messageInput.trim() && !sendMessageOperation.loading
                        ? "bg-teal-500 hover:bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {sendMessageOperation.loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout - Split view */}
        <div className="hidden md:flex w-full h-full overflow-hidden bg-white">
          {/* Conversations Panel */}
          <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white h-full overflow-hidden">
            <div className="flex-shrink-0 border-b border-gray-200 p-4">
              <InboxHeader showBackButton={false} />
            </div>

            <div className="flex-shrink-0 p-4 border-b border-gray-200">
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

            <div className="flex-1 min-h-0 overflow-y-auto">
              <Conversations
                conversations={conversations}
                selectedId={selectedConversation.id}
                setSelected={setSelectedConversation}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
            <div className="flex-shrink-0 bg-white border-b border-gray-200">
              <ChatHeader
                conversation={selectedConversation}
                onCloseChat={() => {
                  console.log("Chat closed on desktop");
                }}
                showBackButton={false}
                showCloseButton={false}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4" style={{ backgroundColor: "#f0f2f5" }}>
              <Messages messages={selectedConversation.messages} />
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
              {showEmojiPicker && (
                <div className="mb-3 bg-white border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-10 gap-2">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-2 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full flex-shrink-0"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <div className="flex items-end bg-white border border-gray-300 rounded-2xl px-4 py-3 focus-within:border-teal-500 transition-colors">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-transparent outline-none text-sm resize-none border-none p-0 min-h-[24px] max-h-[120px] leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEmojiClick}
                      className={`text-gray-500 hover:text-gray-700 p-1 ml-2 flex-shrink-0 ${
                        showEmojiPicker ? "bg-gray-100" : ""
                      }`}
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !messageInput.trim() || sendMessageOperation.loading
                  }
                  className={`p-3 rounded-full transition-all flex-shrink-0 ${
                    messageInput.trim() && !sendMessageOperation.loading
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {sendMessageOperation.loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteErrorBoundary>
  );
};

export default AdminInbox;
