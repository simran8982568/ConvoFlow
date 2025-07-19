import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Template } from './templatesdata';
import { X } from 'lucide-react';

interface EditTemplateModalProps {
  template: Template;
  onClose: () => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  template,
  onClose,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: template.name,
    category: template.category,
    header: template.content.header,
    body: template.content.body,
    footer: template.content.footer,
    buttons: template.content.buttons.length > 0 ? template.content.buttons : [''],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Template Updated",
        description: `Template "${formData.name}" has been updated successfully.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Editing Template</h3>
            <p className="text-sm text-blue-700 mt-1">
              ID: {template.id} • Created: {new Date(template.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-900">
              Status: {template.status}
            </div>
            {template.usageCount !== undefined && (
              <div className="text-xs text-blue-700">
                Used {template.usageCount.toLocaleString()} times
              </div>
            )}
          </div>
        </div>
      </div>

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
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Transactional">Transactional</SelectItem>
              <SelectItem value="Utility">Utility</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="header">Header (Optional)</Label>
          <Input
            id="header"
            value={formData.header}
            onChange={(e) => handleInputChange('header', e.target.value)}
            placeholder="Template header text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Body Text *</Label>
          <Textarea
            id="body"
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Enter your message body..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footer">Footer (Optional)</Label>
          <Input
            id="footer"
            value={formData.footer}
            onChange={(e) => handleInputChange('footer', e.target.value)}
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

      {/* Warning for System Templates */}
      {template.type === 'system' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <h4 className="font-medium text-yellow-900">System Template</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This is a system template. Changes may affect multiple campaigns and require approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default EditTemplateModal;
