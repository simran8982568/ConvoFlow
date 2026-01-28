import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Camera,
  Paperclip,
  Smile,
  Mic,
} from "lucide-react";

interface WhatsAppPreviewProps {
  nodeData: any;
  nodeType: string;
}

const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  nodeData,
  nodeType,
}) => {
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPreview = () => {
    switch (nodeType) {
      case "flowStart":
        return (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Flow Start Node</p>
            <p className="text-xs mt-2">
              Triggers: {(nodeData.triggers || []).join(", ") || "None"}
            </p>
          </div>
        );

      case "message":
        return (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl px-3 py-2 bg-white shadow-sm">
              {nodeData.header && (
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  {nodeData.header}
                </p>
              )}
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {nodeData.text || "No message text"}
              </p>
              {nodeData.footer && (
                <p className="text-xs text-gray-500 mt-1">{nodeData.footer}</p>
              )}
              {nodeData.buttons && nodeData.buttons.length > 0 && (
                <div className="mt-2 space-y-1">
                  {nodeData.buttons.map((button: any, idx: number) => (
                    <button
                      key={idx}
                      className="w-full px-3 py-2 bg-white border border-[#BDE8CC] rounded-full text-sm font-medium text-[#0B9A58] hover:bg-green-50 transition-colors"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {formatTime()}
              </p>
            </div>
          </div>
        );

      case "mediaButtons":
        return (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl overflow-hidden bg-white shadow-sm">
              {nodeData.mediaUrl && (
                <div className="bg-gray-200">
                  {nodeData.mediaType === "image" ? (
                    <img
                      src={nodeData.mediaUrl}
                      alt="Media"
                      className="w-full h-auto max-h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300x200?text=Image";
                      }}
                    />
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-600">
                        📎 {nodeData.mediaType || "media"}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className="px-3 py-2">
                {nodeData.header && (
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    {nodeData.header}
                  </p>
                )}
                {nodeData.text && (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {nodeData.text}
                  </p>
                )}
                {nodeData.footer && (
                  <p className="text-xs text-gray-500 mt-1">
                    {nodeData.footer}
                  </p>
                )}
              </div>
              {nodeData.buttons && nodeData.buttons.length > 0 && (
                <div className="px-3 pb-2 space-y-1">
                  {nodeData.buttons.map((button: any, idx: number) => (
                    <button
                      key={idx}
                      className="w-full px-3 py-2 bg-white border border-[#BDE8CC] rounded-full text-sm font-medium text-[#0B9A58] hover:bg-green-50 transition-colors"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-500 px-3 pb-2 text-right">
                {formatTime()}
              </p>
            </div>
          </div>
        );

      case "list":
        return (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl px-3 py-2 bg-white shadow-sm">
              {nodeData.header && (
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  {nodeData.header}
                </p>
              )}
              <p className="text-sm text-gray-900 mb-2">
                {nodeData.text || "Please select an option"}
              </p>
              {nodeData.footer && (
                <p className="text-xs text-gray-500 mb-2">{nodeData.footer}</p>
              )}
              {nodeData.items && nodeData.items.length > 0 && (
                <div className="space-y-1">
                  {nodeData.items.map((item: any, idx: number) => (
                    <button
                      key={idx}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-left hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {formatTime()}
              </p>
            </div>
          </div>
        );

      case "askQuestion":
        return (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl px-3 py-2 bg-white shadow-sm">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {nodeData.question || "No question configured"}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {formatTime()}
              </p>
            </div>
          </div>
        );

      case "template":
        return (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl px-3 py-2 bg-white shadow-sm border-l-4 border-teal-500">
              <p className="text-xs text-teal-600 font-semibold mb-1">
                📋 {nodeData.templateName || "Template"}
              </p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {nodeData.text || "Template content"}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {formatTime()}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No preview available</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-transparent p-2">
      {/* Phone frame */}
      <div className="relative w-full h-full max-w-[280px] max-h-[560px] rounded-[28px] shadow-xl border-4 border-gray-900 bg-black overflow-hidden">
        {/* Header */}
        <div className="relative z-10 bg-[#075E54] text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 opacity-90" />
            <div className="w-6 h-6 bg-[#0B6A5A] rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">A</span>
            </div>
            <div className="leading-tight">
              <h3 className="text-xs font-semibold">AyuChat</h3>
              <p className="text-[8px] text-[#CDEADF]">online</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-90">
            <Video className="h-4 w-4" />
            <Phone className="h-4 w-4" />
            <MoreVertical className="h-4 w-4" />
          </div>
        </div>

        {/* Background pattern like WhatsApp */}
        <div className="absolute inset-0 top-[40px] bg-[#ECE5DD]">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "radial-gradient(#6b7280 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Chat area */}
        <div className="absolute inset-x-0 top-[40px] bottom-[56px] px-2 py-2 z-10">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <ScrollArea className="h-full w-full p-1">
              <div className="space-y-2">{renderPreview()}</div>
            </ScrollArea>
          </div>
        </div>

        {/* Input bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-2 py-2">
          <div className="w-full bg-white rounded-full px-2 py-1.5 flex items-center gap-1.5 shadow">
            <Smile className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              disabled
              placeholder="Message"
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-500"
            />
            <Camera className="h-4 w-4 text-gray-500" />
            <Paperclip className="h-4 w-4 text-gray-500" />
            <Mic className="h-4 w-4 text-[#25D366]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
