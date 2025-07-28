import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video, FileText, Smile, ExternalLink, Link, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SuperAdminCreateTemplateModalProps {
  onClose: () => void;
  onTemplateCreated: (template: any) => void;
}

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'gif';
  preview: string;
}

const SuperAdminCreateTemplateModal: React.FC<SuperAdminCreateTemplateModalProps> = ({ 
  onClose, 
  onTemplateCreated 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    header: '',
    body: '',
    footer: '',
    buttons: [''],
    url: '',
  });
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [urlError, setUrlError] = useState('');

  const categories = [
    "Marketing",
    "Transactional", 
    "Utility",
    "Authentication",
    "Support"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'url') {
      setUrlError('');
    }
  };

  const handleButtonChange = (index: number, value: string) => {
    const newButtons = [...formData.buttons];
    newButtons[index] = value;
    setFormData(prev => ({
      ...prev,
      buttons: newButtons,
    }));
  };

  const addButton = () => {
    if (formData.buttons.length < 3) {
      setFormData(prev => ({
        ...prev,
        buttons: [...prev.buttons, ''],
      }));
    }
  };

  const removeButton = (index: number) => {
    if (formData.buttons.length > 1) {
      const newButtons = formData.buttons.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        buttons: newButtons,
      }));
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const openUrlPreview = () => {
    if (formData.url && validateUrl(formData.url)) {
      window.open(formData.url, '_blank', 'noopener,noreferrer');
    } else {
      setUrlError('Please enter a valid URL');
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 16 * 1024 * 1024) { // 16MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 16MB`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'gif',
          preview: e.target?.result as string,
        };
        setMediaFiles(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== id));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.body) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Category, Body).",
        variant: "destructive",
      });
      return;
    }

    if (formData.url && !validateUrl(formData.url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newTemplate = {
        id: Date.now(),
        name: formData.name,
        businessName: 'SuperAdmin Global',
        category: formData.category,
        status: 'Approved', // Auto-approved for SuperAdmin
        createdBy: 'SuperAdmin',
        creatorType: 'superadmin',
        submittedAt: new Date().toISOString().split('T')[0],
        content: {
          header: formData.header,
          body: formData.body,
          footer: formData.footer,
          buttons: formData.buttons.filter(btn => btn.trim() !== ''),
          url: formData.url,
        },
        mediaFiles: mediaFiles,
      };

      onTemplateCreated(newTemplate);

      toast({
        title: "Template Created",
        description: `Template "${formData.name}" has been created and is now available to all admins.`,
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
      {/* Header - Simplified without preview option */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
        <p className="text-gray-600 text-sm mt-1">
          Create a new WhatsApp message template with text, images, and buttons.
        </p>
      </div>

      {/* Single Column Form - No more grid layout */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* URL Field */}
        <div className="space-y-2">
          <Label htmlFor="template-url">Template URL (Optional)</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="template-url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com/template-reference"
                className={urlError ? 'border-red-500' : ''}
              />
              {urlError && (
                <p className="text-sm text-red-600 mt-1">{urlError}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openUrlPreview}
              disabled={!formData.url}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Add a reference URL for this template (optional)
          </p>
        </div>

        {/* Media Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media Files (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload images, videos, or GIFs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 16MB
                  </p>
                </label>
              </div>

              {/* Media Preview */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaFiles.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {media.type === 'image' ? (
                          <img
                            src={media.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={media.preview}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(media.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 left-2 text-xs"
                      >
                        {media.type}
                      </Badge>
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
              onChange={(e) => handleInputChange('header', e.target.value)}
              placeholder="Enter header text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message Body *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              placeholder="Enter your message body. Use {{1}}, {{2}} for variables."
              className="min-h-[100px] resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Use {`{{1}}, {{2}}`}, etc. for dynamic variables
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer">Footer (Optional)</Label>
            <Input
              id="footer"
              value={formData.footer}
              onChange={(e) => handleInputChange('footer', e.target.value)}
              placeholder="Enter footer text"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Action Buttons (Optional)</Label>
              {formData.buttons.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addButton}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Button
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {formData.buttons.map((button, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={button}
                    onChange={(e) => handleButtonChange(index, e.target.value)}
                    placeholder={`Button ${index + 1} text`}
                    className="flex-1"
                  />
                  {formData.buttons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeButton(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isLoading ? 'Creating...' : 'Create Template'}
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminCreateTemplateModal;
