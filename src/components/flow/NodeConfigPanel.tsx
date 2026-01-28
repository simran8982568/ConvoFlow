import React, { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { X, Plus, Trash2, Upload, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import WhatsAppPreview from "./WhatsAppPreview";
import { Template, fetchTemplates } from "@/service/api/templates";

interface NodeConfigPanelProps {
  selectedNode: Node;
  onClose: () => void;
  onUpdateNode: (nodeId: string, newData: any) => void;
  onDeleteNode?: (nodeId: string) => void;
  onCopyNode?: (nodeId: string) => void;
}

// Separate component for AddTag configuration to use hooks properly
const AddTagConfig: React.FC<{
  nodeData: any;
  onHandleDataChange: (field: string, value: string | number | boolean) => void;
}> = ({ nodeData, onHandleDataChange }) => {
  const [tags, setTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoadingTags(true);
        // In a real implementation, this would fetch from the API
        // For now, we'll use the dummy tags
        const dummyTags = [
          { id: "tag-1", name: "VIP Customer" },
          { id: "tag-2", name: "Lead" },
          { id: "tag-3", name: "Support" },
          { id: "tag-4", name: "Newsletter" },
          { id: "tag-5", name: "Inactive" },
          { id: "tag-6", name: "New Customer" },
          { id: "tag-7", name: "Returning" },
        ];
        setTags(dummyTags);
      } catch (error) {
        console.error("Failed to load tags:", error);
      } finally {
        setLoadingTags(false);
      }
    };

    loadTags();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label>Select Tag</Label>
        <Select
          value={(nodeData.tagId as string) || ""}
          onValueChange={(value) => {
            const selectedTag = tags.find((tag) => tag.id === value);
            onHandleDataChange("tagId", value);
            if (selectedTag) {
              onHandleDataChange("tagName", selectedTag.name);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            {loadingTags ? (
              <SelectItem value="loading" disabled>
                Loading tags...
              </SelectItem>
            ) : tags.length > 0 ? (
              tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-tags" disabled>
                No tags available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {nodeData.tagName && (
          <p className="text-xs text-gray-500 mt-1">
            Selected: {nodeData.tagName}
          </p>
        )}
      </div>
    </div>
  );
};

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  selectedNode,
  onClose,
  onUpdateNode,
  onDeleteNode,
  onCopyNode,
}) => {
  const [nodeData, setNodeData] = useState(selectedNode.data);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    setNodeData(selectedNode.data);
  }, [selectedNode]);

  const handleDataChange = (field: string, value: any) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    onUpdateNode(selectedNode.id, newData);
  };

  const handleAddButton = () => {
    // Ensure buttons is an array before accessing length
    const buttons = Array.isArray(nodeData.buttons) ? nodeData.buttons : [];
    if (buttons.length >= 3) return;

    const newButton = {
      id: `btn-${Date.now()}`,
      text: `Button ${buttons.length + 1}`,
      type: "quick_reply",
    };
    handleDataChange("buttons", [...buttons, newButton]);
  };

  const handleUpdateButton = (index: number, field: string, value: any) => {
    // Ensure buttons is an array
    const buttons = Array.isArray(nodeData.buttons)
      ? [...nodeData.buttons]
      : [];
    buttons[index] = { ...buttons[index], [field]: value };
    handleDataChange("buttons", buttons);
  };

  const handleDeleteButton = (index: number) => {
    // Ensure buttons is an array
    const buttons = Array.isArray(nodeData.buttons)
      ? [...nodeData.buttons]
      : [];
    buttons.splice(index, 1);
    handleDataChange("buttons", buttons);
  };

  const handleAddListItem = () => {
    // Ensure items is an array
    const items = Array.isArray(nodeData.items) ? nodeData.items : [];
    const newItem = {
      id: `item-${Date.now()}`,
      title: `Item ${items.length + 1}`,
      description: "",
    };
    handleDataChange("items", [...items, newItem]);
  };

  const handleUpdateListItem = (index: number, field: string, value: any) => {
    // Ensure items is an array
    const items = Array.isArray(nodeData.items) ? [...nodeData.items] : [];
    items[index] = { ...items[index], [field]: value };
    handleDataChange("items", items);
  };

  const handleDeleteListItem = (index: number) => {
    // Ensure items is an array
    const items = Array.isArray(nodeData.items) ? [...nodeData.items] : [];
    items.splice(index, 1);
    handleDataChange("items", items);
  };

  const handleAddTrigger = () => {
    // Ensure triggers is an array
    const triggers = Array.isArray(nodeData.triggers) ? nodeData.triggers : [];
    handleDataChange("triggers", [...triggers, ""]);
  };

  const handleUpdateTrigger = (index: number, value: string) => {
    // Ensure triggers is an array
    const triggers = Array.isArray(nodeData.triggers)
      ? [...nodeData.triggers]
      : [];
    triggers[index] = value;
    handleDataChange("triggers", triggers);
  };

  const handleDeleteTrigger = (index: number) => {
    // Ensure triggers is an array
    const triggers = Array.isArray(nodeData.triggers)
      ? [...nodeData.triggers]
      : [];
    triggers.splice(index, 1);
    handleDataChange("triggers", triggers);
  };

  const renderEditContent = (): React.ReactNode => {
    switch (selectedNode.type) {
      case "flowStart":
        return (
          <div className="space-y-4">
            <div>
              <Label>Trigger Keywords</Label>
              <p className="text-xs text-gray-500 mb-2">
                Keywords that will start this flow
              </p>
              <div className="space-y-2">
                {/* Ensure triggers is an array before mapping */}
                {Array.isArray(nodeData.triggers)
                  ? nodeData.triggers.map((trigger, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={trigger}
                          onChange={(e) =>
                            handleUpdateTrigger(idx, e.target.value)
                          }
                          placeholder="Enter keyword"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteTrigger(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  : []}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTrigger}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trigger
                </Button>
              </div>
            </div>
          </div>
        );

      case "message":
      case "mediaButtons":
        return (
          <div className="space-y-4">
            {selectedNode.type === "mediaButtons" && (
              <>
                <div>
                  <Label>Media Type</Label>
                  <Select
                    value={(nodeData.mediaType as string) || "image"}
                    onValueChange={(value) =>
                      handleDataChange("mediaType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Media URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={(nodeData.mediaUrl as string) || ""}
                      onChange={(e) =>
                        handleDataChange("mediaUrl", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              // For now, we'll just use the base64 data URL
                              // In the future, this would be replaced with actual upload endpoint
                              handleDataChange(
                                "mediaUrl",
                                event.target?.result as string
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image or enter a URL
                  </p>
                </div>
              </>
            )}
            <div>
              <Label>Header (Optional)</Label>
              <Input
                value={(nodeData.header as string) || ""}
                onChange={(e) => handleDataChange("header", e.target.value)}
                placeholder="Message header"
              />
            </div>
            <div>
              <Label>Message Text</Label>
              <Textarea
                value={(nodeData.text as string) || ""}
                onChange={(e) => handleDataChange("text", e.target.value)}
                placeholder="Enter your message text..."
                rows={4}
              />
            </div>
            <div>
              <Label>Footer (Optional)</Label>
              <Input
                value={(nodeData.footer as string) || ""}
                onChange={(e) => handleDataChange("footer", e.target.value)}
                placeholder="Message footer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Buttons (Max 3)</Label>
                {/* Ensure buttons is an array before accessing length */}
                <span className="text-xs text-gray-500">
                  {Array.isArray(nodeData.buttons)
                    ? nodeData.buttons.length
                    : 0}
                  /3
                </span>
              </div>
              <div className="space-y-2">
                {/* Ensure buttons is an array before mapping */}
                {Array.isArray(nodeData.buttons)
                  ? nodeData.buttons.map((button, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex gap-2">
                          <Input
                            value={button.text}
                            onChange={(e) =>
                              handleUpdateButton(idx, "text", e.target.value)
                            }
                            placeholder="Button text"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteButton(idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Select
                          value={button.type || "quick_reply"}
                          onValueChange={(value) =>
                            handleUpdateButton(idx, "type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quick_reply">
                              Quick Reply
                            </SelectItem>
                            <SelectItem value="postback">Postback</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                          </SelectContent>
                        </Select>
                        {button.type === "url" && (
                          <Input
                            value={button.url || ""}
                            onChange={(e) =>
                              handleUpdateButton(idx, "url", e.target.value)
                            }
                            placeholder="https://example.com"
                          />
                        )}
                      </div>
                    ))
                  : []}
                {/* Ensure buttons is an array before checking length */}
                {(Array.isArray(nodeData.buttons)
                  ? nodeData.buttons.length
                  : 0) < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddButton}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Button
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-4">
            <div>
              <Label>Header (Optional)</Label>
              <Input
                value={(nodeData.header as string) || ""}
                onChange={(e) => handleDataChange("header", e.target.value)}
                placeholder="List header"
              />
            </div>
            <div>
              <Label>List Text</Label>
              <Textarea
                value={(nodeData.text as string) || ""}
                onChange={(e) => handleDataChange("text", e.target.value)}
                placeholder="Enter your list description..."
                rows={3}
              />
            </div>
            <div>
              <Label>Footer (Optional)</Label>
              <Input
                value={(nodeData.footer as string) || ""}
                onChange={(e) => handleDataChange("footer", e.target.value)}
                placeholder="List footer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>List Items</Label>
                {/* Ensure items is an array before accessing length */}
                <span className="text-xs text-gray-500">
                  {Array.isArray(nodeData.items) ? nodeData.items.length : 0}/10
                </span>
              </div>
              <div className="space-y-2">
                {/* Ensure items is an array before mapping */}
                {Array.isArray(nodeData.items)
                  ? nodeData.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            handleUpdateListItem(idx, "title", e.target.value)
                          }
                          placeholder="Item title"
                        />
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            handleUpdateListItem(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Item description (optional)"
                          rows={2}
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteListItem(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  : []}
                {/* Ensure items is an array before checking length */}
                {(Array.isArray(nodeData.items) ? nodeData.items.length : 0) <
                  10 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddListItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add List Item
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case "askQuestion":
        return (
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Textarea
                value={(nodeData.question as string) || ""}
                onChange={(e) => handleDataChange("question", e.target.value)}
                placeholder="What is your name?"
                rows={3}
              />
            </div>
            <div>
              <Label>Attribute Name</Label>
              <Input
                value={(nodeData.attributeName as string) || ""}
                onChange={(e) =>
                  handleDataChange("attributeName", e.target.value)
                }
                placeholder="user_name"
              />
              <p className="text-xs text-gray-500 mt-1">
                The answer will be stored in this attribute
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label>Required Field</Label>
              <Switch
                checked={(nodeData.required as boolean) || false}
                onCheckedChange={(checked) =>
                  handleDataChange("required", checked)
                }
              />
            </div>
            <div>
              <Label>Validation Type</Label>
              <Select
                value={(nodeData.validationType as string) || "text"}
                onValueChange={(value) =>
                  handleDataChange("validationType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="regex">Regex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Error Message</Label>
              <Input
                value={(nodeData.errorMessage as string) || ""}
                onChange={(e) =>
                  handleDataChange("errorMessage", e.target.value)
                }
                placeholder="Please enter a valid value"
              />
            </div>
          </div>
        );

      case "setAttribute":
        return (
          <div className="space-y-4">
            <div>
              <Label>Attribute Name</Label>
              <Input
                value={(nodeData.attributeName as string) || ""}
                onChange={(e) =>
                  handleDataChange("attributeName", e.target.value)
                }
                placeholder="attribute_name"
              />
            </div>
            <div>
              <Label>Attribute Value</Label>
              <Input
                value={(nodeData.attributeValue as string) || ""}
                onChange={(e) =>
                  handleDataChange("attributeValue", e.target.value)
                }
                placeholder="value"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {`{{variable}}`} for dynamic values
              </p>
            </div>
          </div>
        );

      case "addTag":
        return (
          <AddTagConfig
            nodeData={nodeData}
            onHandleDataChange={handleDataChange}
          />
        );

      case "apiRequest":
        return (
          <div className="space-y-4">
            <div>
              <Label>API URL</Label>
              <Input
                value={(nodeData.url as string) || ""}
                onChange={(e) => handleDataChange("url", e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <Label>HTTP Method</Label>
              <Select
                value={(nodeData.method as string) || "GET"}
                onValueChange={(value) => handleDataChange("method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Response Attribute</Label>
              <Input
                value={(nodeData.responseAttribute as string) || ""}
                onChange={(e) =>
                  handleDataChange("responseAttribute", e.target.value)
                }
                placeholder="api_response"
              />
              <p className="text-xs text-gray-500 mt-1">
                Store API response in this attribute
              </p>
            </div>
          </div>
        );

      case "template":
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Template</Label>
              <Select
                value={(nodeData.templateId as string) || ""}
                onValueChange={(value) => {
                  // In a real implementation, we would fetch the template details
                  // For now, we'll just update the templateId
                  handleDataChange("templateId", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template_1">Welcome Message</SelectItem>
                  <SelectItem value="template_2">Order Confirmation</SelectItem>
                  <SelectItem value="template_3">
                    Appointment Reminder
                  </SelectItem>
                  <SelectItem value="template_4">Feedback Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Template Name</Label>
              <Input
                value={(nodeData.templateName as string) || ""}
                onChange={(e) =>
                  handleDataChange("templateName", e.target.value)
                }
                placeholder="Template name"
              />
            </div>
            <div>
              <Label>Template Text</Label>
              <Textarea
                value={(nodeData.text as string) || ""}
                onChange={(e) => handleDataChange("text", e.target.value)}
                placeholder="Template content..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>No configuration available for this node type</p>
          </div>
        );
    }
  };

  return (
    <div
      className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg"
      style={{ minWidth: "24rem" }}
    >
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {(nodeData.label as string) || "Node Configuration"}
        </h3>
        <div className="flex items-center gap-1">
          {onDeleteNode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteNode(selectedNode.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onCopyNode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopyNode(selectedNode.id)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 mt-3">
          <TabsTrigger value="edit" className="flex-1">
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-4">{renderEditContent()}</div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <div className="h-full p-4">
            <div className="bg-gray-50 rounded-lg h-full flex items-center justify-center">
              <WhatsAppPreview
                nodeData={nodeData}
                nodeType={selectedNode.type || "message"}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeConfigPanel;
