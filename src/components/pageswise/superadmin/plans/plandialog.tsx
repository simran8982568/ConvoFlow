import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Plan {
  id: number;
  name: string;
  price: number;
  messageQuota: number;
  automationLimit: number;
  contactLimit: number;
  features: string[];
  isActive: boolean;
  subscribers: number;
}

interface PlanFormData {
  name: string;
  price: number;
  messageQuota: number;
  automationLimit: number;
  contactLimit: number;
  features: string[];
  isActive: boolean;
}

interface PlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: PlanFormData) => void;
  selectedPlan: Plan | null;
  loading?: boolean;
}

const PlanDialog: React.FC<PlanDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedPlan,
  loading = false
}) => {
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    price: 0,
    messageQuota: 0,
    automationLimit: 0,
    contactLimit: 0,
    features: [],
    isActive: true
  });

  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState<Partial<PlanFormData>>({});

  useEffect(() => {
    if (selectedPlan) {
      setFormData({
        name: selectedPlan.name,
        price: selectedPlan.price,
        messageQuota: selectedPlan.messageQuota,
        automationLimit: selectedPlan.automationLimit,
        contactLimit: selectedPlan.contactLimit,
        features: [...selectedPlan.features],
        isActive: selectedPlan.isActive
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        messageQuota: 0,
        automationLimit: 0,
        contactLimit: 0,
        features: [],
        isActive: true
      });
    }
    setErrors({});
    setNewFeature('');
  }, [selectedPlan, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PlanFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.messageQuota <= 0) {
      newErrors.messageQuota = 'Message quota must be greater than 0';
    }

    if (formData.automationLimit <= 0) {
      newErrors.automationLimit = 'Automation limit must be greater than 0';
    }

    if (formData.contactLimit <= 0) {
      newErrors.contactLimit = 'Contact limit must be greater than 0';
    }

    if (formData.features.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const addFeature = () => {
    const feature = newFeature.trim();
    if (feature && !formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: [...formData.features, feature]
      });
      setNewFeature('');
      // Clear features error if it exists
      if (errors.features) {
        setErrors({ ...errors, features: undefined });
      }
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
          </DialogTitle>
          <DialogDescription>
            Configure plan details and features
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Pro"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="price">Price (₹/month) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                placeholder="2999"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="messages">Messages *</Label>
              <Input
                id="messages"
                type="number"
                min="1"
                value={formData.messageQuota}
                onChange={(e) => setFormData({...formData, messageQuota: parseInt(e.target.value) || 0})}
                placeholder="5000"
                className={errors.messageQuota ? 'border-red-500' : ''}
              />
              {errors.messageQuota && (
                <p className="text-sm text-red-500 mt-1">{errors.messageQuota}</p>
              )}
            </div>
            <div>
              <Label htmlFor="automations">Automations *</Label>
              <Input
                id="automations"
                type="number"
                min="1"
                value={formData.automationLimit}
                onChange={(e) => setFormData({...formData, automationLimit: parseInt(e.target.value) || 0})}
                placeholder="20"
                className={errors.automationLimit ? 'border-red-500' : ''}
              />
              {errors.automationLimit && (
                <p className="text-sm text-red-500 mt-1">{errors.automationLimit}</p>
              )}
            </div>
            <div>
              <Label htmlFor="contacts">Contacts *</Label>
              <Input
                id="contacts"
                type="number"
                min="1"
                value={formData.contactLimit}
                onChange={(e) => setFormData({...formData, contactLimit: parseInt(e.target.value) || 0})}
                placeholder="10000"
                className={errors.contactLimit ? 'border-red-500' : ''}
              />
              {errors.contactLimit && (
                <p className="text-sm text-red-500 mt-1">{errors.contactLimit}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
            />
            <Label htmlFor="active">Plan is active</Label>
          </div>

          <div>
            <Label>Features *</Label>
            <div className="space-y-2 mt-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">{feature}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature"
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  disabled={!newFeature.trim()}
                >
                  Add
                </Button>
              </div>
              {errors.features && (
                <p className="text-sm text-red-500">{errors.features}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : (selectedPlan ? 'Update Plan' : 'Create Plan')}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
