import React from "react";
import { Clock, CheckCheck } from "lucide-react";
import { Template } from "./templatesdata";

interface WhatsAppPreviewModalProps {
  template: Template;
  onClose: () => void;
}

const categoryMeta: Record<
  string,
  { icon: string; label: string; charge: string; color: string }
> = {
  Marketing: {
    icon: "🛍️",
    label: "Marketing",
    charge: "Charge",
    color: "bg-pink-100 text-pink-700",
  },
  Utility: {
    icon: "📦",
    label: "Utility",
    charge: "Charge",
    color: "bg-blue-100 text-blue-700",
  },
  Authentication: {
    icon: "🔐",
    label: "Authentication",
    charge: "Charge",
    color: "bg-yellow-100 text-yellow-700",
  },
};

const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  template,
  onClose,
}) => {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const meta = categoryMeta[template.category] || categoryMeta["Marketing"];

  return (
    <div className="bg-[#ece5dd] rounded-lg overflow-hidden relative">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 relative">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#075e54] font-semibold text-sm">YB</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium flex items-center gap-1">
            Business Account
            <span className="ml-1 text-xs bg-green-200 text-green-700 px-1 rounded">
              ✔
            </span>
          </h3>
          <p className="text-xs text-teal-100">Online</p>
        </div>
        {/* Category badge top-right */}
        {/* Removed category and charge badge from header as requested */}
      </div>

      {/* Chat Area */}
      <div className="bg-[#ece5dd] p-4 min-h-[400px] max-h-[500px] overflow-y-auto relative">
        {/* WhatsApp Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Message Bubble */}
        <div className="flex justify-end mb-4">
          <div className="max-w-xs lg:max-w-md">
            <div className="rounded-lg border border-green-300 p-3 bg-white shadow relative">
              {/* Removed charge badge from bubble as requested */}
              {/* Media (Optional) */}
              {template.mediaUrl && (
                <div className="mb-2">
                  <img
                    src={template.mediaUrl}
                    alt="media"
                    className="rounded-lg w-full max-h-40 object-cover"
                  />
                </div>
              )}
              {/* Header (Optional) */}
              {template.content.header && (
                <div className="font-bold text-sm mb-2 border-b border-green-400 pb-2">
                  {template.content.header}
                </div>
              )}

              {/* Body */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900">
                {template.content.body}
              </div>

              {/* Footer (Optional) */}
              {template.content.footer && (
                <div className="text-xs text-green-600 mt-2 pt-2 border-t border-green-400">
                  {template.content.footer}
                </div>
              )}

              {/* CTA Buttons (Marketing/Utility only, max 3) */}
              {(template.category === "Marketing" ||
                template.category === "Utility") &&
                template.content.buttons &&
                template.content.buttons.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {template.content.buttons
                      .slice(0, 3)
                      .filter((button) => button.trim())
                      .map((button, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-[#128c7e] to-[#075e54] text-white px-3 py-1 rounded-lg inline-block text-center text-sm font-semibold cursor-pointer border border-[#075e54] shadow-lg hover:scale-105 transition-transform duration-150"
                        >
                          <span className="inline-flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4 text-white mr-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 12.75l2.25 2.25 5.25-5.25"
                              />
                            </svg>
                            {button}
                          </span>
                        </div>
                      ))}
                  </div>
                )}

              {/* Message Status */}
              <div className="flex items-center justify-end mt-2 gap-1">
                <span className="text-xs text-gray-400">{currentTime}</span>
                <CheckCheck className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <div className="bg-white rounded-lg p-3 shadow-sm inline-block">
            <p className="font-medium text-gray-700">Template Preview</p>
            <p className="text-gray-500 mt-1">
              Category: {meta.label} • Status: {template.status}
            </p>
            {template.usageCount !== undefined && (
              <p className="text-gray-500">
                Used {template.usageCount.toLocaleString()} times
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Template:</span> {template.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            Created {new Date(template.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreviewModal;
