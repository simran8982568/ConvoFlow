import React from "react";
import { X, Phone, Video, MoreVertical, Send, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationMessage } from "@/service/flowEngine";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: SimulationMessage[];
  isWaitingForInput: boolean;
  isSimulationStarted: boolean;
  onStartSimulation: () => void;
  onSendMessage: (message: string) => void;
  onButtonClick: (buttonText: string) => void;
  onListItemClick: (itemTitle: string) => void;
}

const SimulatorDrawer: React.FC<SimulatorDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  isWaitingForInput,
  isSimulationStarted,
  onStartSimulation,
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[380px] p-0 flex flex-col sm:w-[400px]"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Flow Simulation</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-gray-800">
            <div className="bg-[#075E54] text-white px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-base font-semibold">A</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AyuChat Bot</h3>
                  <p className="text-[10px] text-teal-100">
                    {isSimulationStarted ? "online" : "offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-teal-700 h-7 w-7 p-1"
                >
                  <Video className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-teal-700 h-7 w-7 p-1"
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-teal-700 h-7 w-7 p-1"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px] bg-[#e5ddd5] p-3">
              {!isSimulationStarted ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="h-6 w-6 text-teal-600" />
                    </div>
                    <p className="text-gray-600 text-xs mb-3">
                      Click "Start Simulation" to begin
                    </p>
                    <p className="text-gray-500 text-[10px]">
                      You'll see messages as users would receive them
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-2 py-1.5 ${
                          message.type === "user"
                            ? "bg-[#DCF8C6]"
                            : "bg-white shadow-sm"
                        }`}
                      >
                        {message.mediaUrl && (
                          <div className="mb-1.5 rounded overflow-hidden">
                            {message.mediaType === "image" ? (
                              <img
                                src={message.mediaUrl}
                                alt="Media"
                                className="w-full h-auto max-h-32 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/300x200?text=Image";
                                }}
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

                        <p className="text-xs text-gray-900 whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {message.buttons && message.buttons.length > 0 && (
                          <div className="mt-1.5 space-y-1">
                            {message.buttons.map((button) => (
                              <button
                                key={button.id}
                                onClick={() => onButtonClick(button.text)}
                                className="w-full px-2 py-1.5 bg-white border border-[#BDE8CC] rounded-full text-xs font-medium text-[#0B9A58] hover:bg-green-50 transition-colors"
                              >
                                {button.text}
                              </button>
                            ))}
                          </div>
                        )}

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

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p className="text-[10px] text-gray-500">
                            {formatTime(message.timestamp)}
                          </p>
                          {message.type === "bot" && (
                            <span className="text-[10px] text-[#4FC3F7]">
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="bg-gray-100 px-2 py-1.5 flex items-center gap-1.5">
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
                className="rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 h-7 w-7"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {!isSimulationStarted && (
          <div className="p-3 border-t border-gray-200">
            <Button
              onClick={onStartSimulation}
              className="w-full bg-teal-600 hover:bg-teal-700 h-9 text-sm"
            >
              <Play className="h-3 w-3 mr-1.5" />
              Start Simulation
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SimulatorDrawer;
