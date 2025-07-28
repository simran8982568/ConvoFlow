import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockConversations } from "./mockdata";
import InboxHeader from "./header";
import ChatHeader from "./chatheader";
import Conversations from "./conversations";
import Messages from "./messages";
import { AdminSidebar } from "@/components/common/admin";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingStates";
import useAsyncOperation from "@/hooks/useAsyncOperation";
import "./inbox.css";

const AdminInbox: React.FC = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && !event.target) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessageOperation.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Message sent:', messageInput);
      return { success: true };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
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

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥'];

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
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
      <div className="app-container">
        
        {/* Mobile Layout */}
        <div className="mobile-layout md:hidden">
          {showMobileConversations ? (
            // Mobile Conversations View
            <div className="mobile-conversations-view">
              <div className="mobile-header">
                <InboxHeader />
              </div>
              <div className="mobile-search-section">
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
              <div className="mobile-conversations-list">
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
            <div className="mobile-chat-view">
              <div className="mobile-chat-header">
                <ChatHeader
                  conversation={selectedConversation}
                  onToggleMobileConversations={toggleMobileConversations}
                  onCloseChat={() => setShowMobileConversations(true)}
                  showBackButton={true}
                  showCloseButton={true}
                />
              </div>
              
              <div className="mobile-messages-section">
                <div
                  className="mobile-messages-content"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: '#f0f2f5'
                  }}
                >
                  <Messages messages={selectedConversation.messages} />
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="mobile-input-section">
                {showEmojiPicker && (
                  <div className="mobile-emoji-picker">
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

                <div className="mobile-input-wrapper">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2 rounded-full flex-shrink-0">
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
                          className={`text-gray-500 hover:text-gray-700 p-1 ml-2 flex-shrink-0 ${showEmojiPicker ? 'bg-gray-100' : ''}`}
                        >
                          <Smile className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendMessageOperation.loading}
                      className={`p-3 rounded-full transition-all flex-shrink-0 ${
                        messageInput.trim() && !sendMessageOperation.loading
                          ? "bg-teal-500 hover:bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {sendMessageOperation.loading ? <LoadingSpinner size="sm" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout with Existing AdminSidebar */}
        <div className="desktop-layout hidden md:flex">
          <div className="admin-sidebar-wrapper">
            <AdminSidebar />
          </div>

          {/* Conversations Panel */}
          <div className="conversations-panel">
            <div className="conversations-header">
              <InboxHeader />
            </div>
            <div className="conversations-search">
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
            <div className="conversations-list">
              <Conversations
                conversations={conversations}
                selectedId={selectedConversation.id}
                setSelected={setSelectedConversation}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* Chat Panel */}
          <div className="chat-panel">
            <div className="chat-header">
              <ChatHeader 
                conversation={selectedConversation}
                onCloseChat={() => {
                  console.log('Chat closed on desktop');
                }}
                showCloseButton={true}
              />
            </div>
            
            <div className="chat-messages-section">
              <div
                className="chat-messages-content"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundColor: '#f0f2f5'
                }}
              >
                <Messages messages={selectedConversation.messages} />
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input-section">
              {showEmojiPicker && (
                <div className="desktop-emoji-picker">
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

              <div className="chat-input-wrapper">
                <div className="flex items-end gap-3">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2 rounded-full flex-shrink-0">
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
                        className={`text-gray-500 hover:text-gray-700 p-1 ml-2 flex-shrink-0 ${showEmojiPicker ? 'bg-gray-100' : ''}`}
                      >
                        <Smile className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendMessageOperation.loading}
                    className={`p-3 rounded-full transition-all flex-shrink-0 ${
                      messageInput.trim() && !sendMessageOperation.loading
                        ? "bg-teal-500 hover:bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {sendMessageOperation.loading ? <LoadingSpinner size="sm" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteErrorBoundary>
  );
};

export default AdminInbox;
