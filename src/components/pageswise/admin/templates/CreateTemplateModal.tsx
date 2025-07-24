import React, { useState } from "react";
import { Upload, X, Image, Video, FileText, Smile } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CreateTemplateModalProps {
  onClose: () => void;
  onTemplateCreated: (template: any) => void;
}

interface MediaFile {
  id: string;
  file: File;
  type: "image" | "video" | "gif";
  preview: string;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  onClose,
  onTemplateCreated,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    header: "",
    body: "",
    footer: "",
    buttons: [""],
  });
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleButtonChange = (index: number, value: string) => {
    const newButtons = [...formData.buttons];
    newButtons[index] = value;
    setFormData((prev) => ({
      ...prev,
      buttons: newButtons,
    }));
  };

  const addButton = () => {
    if (formData.buttons.length < 3) {
      setFormData((prev) => ({
        ...prev,
        buttons: [...prev.buttons, ""],
      }));
    }
  };

  const removeButton = (index: number) => {
    if (formData.buttons.length > 1) {
      const newButtons = formData.buttons.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        buttons: newButtons,
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith("image/")
        ? file.type.includes("gif")
          ? "gif"
          : "image"
        : file.type.startsWith("video/")
        ? "video"
        : null;

      if (fileType) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia: MediaFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            type: fileType as "image" | "video" | "gif",
            preview: e.target?.result as string,
          };
          setMediaFiles((prev) => [...prev, newMedia]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => prev.filter((media) => media.id !== id));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.body) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the template object
      const newTemplate = {
        name: formData.name,
        category: formData.category,
        type: "custom" as const,
        status: "pending" as const,
        content: {
          header: formData.header,
          body: formData.body,
          footer: formData.footer,
          buttons: formData.buttons.filter((btn) => btn.trim() !== ""),
        },
      };

      // Add the template using the callback
      onTemplateCreated(newTemplate);

      toast({
        title: "Template Created",
        description: `Template "${formData.name}" has been created successfully.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name *</Label>
          <Input
            id="template-name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter template name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Utility">Utility</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.gif"
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload images, videos, or GIFs
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: JPG, PNG, GIF, MP4, MOV (Max 16MB)
                </p>
              </label>
            </div>

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaFiles.map((media) => (
                  <div key={media.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {media.type === "video" ? (
                        <video
                          src={media.preview}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={media.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 text-xs"
                    >
                      {media.type.toUpperCase()}
                    </Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(media.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="header">Header (Optional)</Label>
          <Input
            id="header"
            value={formData.header}
            onChange={(e) => handleInputChange("header", e.target.value)}
            placeholder="Template header text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Body Text *</Label>
          <Textarea
            id="body"
            value={formData.body}
            onChange={(e) => handleInputChange("body", e.target.value)}
            placeholder="Enter your message body..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footer">Footer (Optional)</Label>
          <Input
            id="footer"
            value={formData.footer}
            onChange={(e) => handleInputChange("footer", e.target.value)}
            placeholder="Footer text"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Action Buttons (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.buttons.map((button, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={button}
                  onChange={(e) => handleButtonChange(index, e.target.value)}
                  placeholder={`Button ${index + 1} text`}
                />
                {formData.buttons.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeButton(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {formData.buttons.length < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addButton}
                className="w-full"
              >
                Add Button
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isLoading ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
