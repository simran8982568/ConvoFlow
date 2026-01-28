import React from 'react';
import { X, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ValidationError } from '@/utils/flowUtils';

interface ValidationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationError[];
  onErrorClick: (nodeId?: string) => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  isOpen,
  onClose,
  errors,
  onErrorClick,
}) => {
  const errorCount = errors.filter((e) => e.type === 'error').length;
  const warningCount = errors.filter((e) => e.type === 'warning').length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] p-0 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Validation Results</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {errors.length > 0 && (
            <div className="flex gap-4 mt-2 text-sm">
              {errorCount > 0 && (
                <span className="text-red-600 font-medium">
                  {errorCount} Error{errorCount !== 1 ? 's' : ''}
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-yellow-600 font-medium">
                  {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {errors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Validation Passed ✓
                </h4>
                <p className="text-sm text-gray-600">
                  Your flow has no errors or warnings!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {errors.map((error, idx) => (
                  <div
                    key={idx}
                    onClick={() => onErrorClick(error.nodeId)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      error.type === 'error'
                        ? 'bg-red-50 border-red-200 hover:border-red-300'
                        : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                    } ${error.nodeId ? 'cursor-pointer hover:shadow-md' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {error.type === 'error' ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium mb-1 ${
                            error.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                          }`}
                        >
                          {error.type === 'error' ? 'Error' : 'Warning'}
                        </p>
                        <p className="text-sm text-gray-700">{error.message}</p>
                        {error.nodeId && (
                          <p className="text-xs text-gray-500 mt-2">
                            Click to highlight node
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ValidationPanel;