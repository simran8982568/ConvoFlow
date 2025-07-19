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
import { useToast } from '@/hooks/use-toast';
import { Campaign } from './mockdata';

interface CampaignEditModalProps {
  campaign: Campaign;
  onClose: () => void;
}

const CampaignEditModal: React.FC<CampaignEditModalProps> = ({
  campaign,
  onClose,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: campaign.name,
    template: campaign.template,
    audience: campaign.audience,
    scheduled: campaign.scheduled,
    type: campaign.type,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Campaign Updated",
        description: `"${formData.name}" has been successfully updated.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name</Label>
        <Input
          id="campaign-name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter campaign name"
        />
      </div>

      {/* Template Selection */}
      <div className="space-y-2">
        <Label htmlFor="template">Template</Label>
        <Select
          value={formData.template}
          onValueChange={(value) => handleInputChange('template', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Welcome New Customer">Welcome New Customer</SelectItem>
            <SelectItem value="Product Announcement">Product Announcement</SelectItem>
            <SelectItem value="Black Friday Sale">Black Friday Sale</SelectItem>
            <SelectItem value="Cart Reminder">Cart Reminder</SelectItem>
            <SelectItem value="Order Confirmation">Order Confirmation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audience Selection */}
      <div className="space-y-2">
        <Label htmlFor="audience">Target Audience</Label>
        <Select
          value={formData.audience}
          onValueChange={(value) => handleInputChange('audience', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Customers">All Customers (2,500)</SelectItem>
            <SelectItem value="New Customers">New Customers (450)</SelectItem>
            <SelectItem value="VIP Customers">VIP Customers (180)</SelectItem>
            <SelectItem value="Abandoned Carts">Abandoned Carts (320)</SelectItem>
            <SelectItem value="Inactive Users">Inactive Users (890)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Campaign Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleInputChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Broadcast">Broadcast</SelectItem>
            <SelectItem value="Automated">Automated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Schedule */}
      <div className="space-y-2">
        <Label htmlFor="scheduled">Schedule</Label>
        <Input
          id="scheduled"
          type="datetime-local"
          value={formData.scheduled.replace(' ', 'T')}
          onChange={(e) => handleInputChange('scheduled', e.target.value.replace('T', ' '))}
        />
      </div>

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

export default CampaignEditModal;
