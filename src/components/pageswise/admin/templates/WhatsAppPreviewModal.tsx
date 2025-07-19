import React from 'react';
import { Clock, Check, CheckCheck } from 'lucide-react';
import { Template } from './templatesdata';

interface WhatsAppPreviewModalProps {
  template: Template;
  onClose: () => void;
}

const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  template,
  onClose,
}) => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      {/* WhatsApp Header */}
      <div className="bg-teal-600 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-teal-600 font-semibold text-sm">YB</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Your Business</h3>
          <p className="text-xs text-teal-100">Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-gray-50 p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
        {/* WhatsApp Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Message Bubble */}
        <div className="flex justify-end mb-4">
          <div className="max-w-xs lg:max-w-md">
            <div className="bg-green-500 text-white rounded-lg p-3 shadow-sm">
              {/* Header */}
              {template.content.header && (
                <div className="font-semibold text-sm mb-2 border-b border-green-400 pb-2">
                  {template.content.header}
                </div>
              )}

              {/* Body */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {template.content.body}
              </div>

              {/* Footer */}
              {template.content.footer && (
                <div className="text-xs text-green-100 mt-2 pt-2 border-t border-green-400">
                  {template.content.footer}
                </div>
              )}

              {/* Action Buttons */}
              {template.content.buttons && template.content.buttons.length > 0 && (
                <div className="mt-3 space-y-1">
                  {template.content.buttons
                    .filter(button => button.trim())
                    .map((button, index) => (
                      <div
                        key={index}
                        className="bg-green-600 hover:bg-green-700 transition-colors rounded px-3 py-2 text-center text-sm font-medium cursor-pointer border border-green-400"
                      >
                        {button}
                      </div>
                    ))}
                </div>
              )}

              {/* Message Status */}
              <div className="flex items-center justify-end mt-2 gap-1">
                <span className="text-xs text-green-100">{currentTime}</span>
                <CheckCheck className="w-4 h-4 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <div className="bg-white rounded-lg p-3 shadow-sm inline-block">
            <p className="font-medium text-gray-700">Template Preview</p>
            <p className="text-gray-500 mt-1">
              Category: {template.category} • Status: {template.status}
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
