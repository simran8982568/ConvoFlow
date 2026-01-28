import React from "react";
import { X, Phone, Video, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationMessage } from "@/service/flowEngine";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: SimulationMessage[];
  isWaitingForInput: boolean;
  onSendMessage: (message: string) => void;
  onButtonClick: (buttonText: string) => void;
  onListItemClick: (itemTitle: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  isOpen,
  onClose,
  messages,
  isWaitingForInput,
  onSendMessage,
  onButtonClick,
  onListItemClick,
}) => {
  const [inputText, setInputText] = React.useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* WhatsApp Header */}
      <div className="bg-teal-700 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-base font-semibold">A</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">AyuChat Bot</h3>
            <p className="text-[10px] text-teal-100">typing...</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-teal-600 h-7 w-7 p-1"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-teal-600 h-7 w-7 p-1"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-teal-600 h-7 w-7 p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-teal-600 h-7 w-7 p-1"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-3 bg-[#e5ddd5]">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-2 py-1.5 ${
                  message.type === "user"
                    ? "bg-[#dcf8c6]"
                    : "bg-white shadow-sm"
                }`}
              >
                {/* Media */}
                {message.mediaUrl && (
                  <div className="mb-1.5 rounded overflow-hidden">
                    {message.mediaType === "image" ? (
                      <img
                        src={message.mediaUrl}
                        alt="Media"
                        className="w-full h-auto max-h-32 object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 p-3 text-center">
                        <p className="text-xs text-gray-600">
                          📎 {message.mediaType}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Text */}
                <p className="text-xs text-gray-900 whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* Buttons */}
                {message.buttons && message.buttons.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {message.buttons.map((button) => (
                      <button
                        key={button.id}
                        onClick={() => onButtonClick(button.text)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-teal-600 hover:bg-gray-50 transition-colors"
                      >
                        {button.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* List Items */}
                {message.listItems && message.listItems.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {message.listItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onListItemClick(item.title)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-left hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-xs font-medium text-gray-900">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-[10px] text-gray-500 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-1.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            isWaitingForInput ? "Type a message..." : "Simulation paused"
          }
          disabled={!isWaitingForInput}
          className="flex-1 px-3 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:border-teal-500 disabled:bg-gray-200 disabled:cursor-not-allowed text-xs"
        />
        <Button
          onClick={handleSend}
          disabled={!isWaitingForInput || !inputText.trim()}
          size="icon"
          className="rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RightPanel;
