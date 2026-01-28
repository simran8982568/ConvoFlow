import React, { useState, useEffect } from "react";
import { FileText, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Template,
  fetchTemplates,
  syncTemplates,
} from "@/service/api/templates";
import { generateNodeId } from "@/utils/flowUtils";
import { Node } from "@xyflow/react";

interface TemplateSelectionProps {
  onAddTemplateNode: (template: Template) => void;
  onDragStart: (
    event: React.DragEvent,
    nodeType: string,
    template?: Template
  ) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  onAddTemplateNode,
  onDragStart,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTemplates = async () => {
    try {
      setSyncing(true);
      const data = await syncTemplates();
      setTemplates(data);
      toast({
        title: "Success",
        description: "Templates synced successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync templates",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDragStart = (event: React.DragEvent, template: Template) => {
    onDragStart(event, "template", template);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Templates</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSyncTemplates}
          disabled={syncing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-4">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No templates found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleSyncTemplates}
            disabled={syncing}
          >
            {syncing ? "Syncing..." : "Sync Templates"}
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-64">
          <div className="space-y-2 pr-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group rounded-lg border-2 cursor-move transition-all hover:shadow-md hover:scale-[1.02]"
                style={{ borderColor: "#6366f1" }}
                draggable
                onDragStart={(e) => handleDragStart(e, template)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {template.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {template.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {template.language}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          template.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : template.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {template.status}
                      </span>
                    </div>
                  </div>

                  {template.components.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {template.components[0].text}
                    </p>
                  )}

                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddTemplateNode(template);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default TemplateSelection;
