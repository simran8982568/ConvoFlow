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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Workflow } from './types';
import { Zap, Plus, X, MessageSquare, Clock, Tag } from 'lucide-react';

interface AutomationEditModalProps {
  workflow: Workflow;
  onClose: () => void;
}

const AutomationEditModal: React.FC<AutomationEditModalProps> = ({
  workflow,
  onClose,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: workflow.name,
    description: workflow.description,
    trigger: workflow.trigger,
    status: workflow.status,
  });

  const [workflowSteps, setWorkflowSteps] = useState([
    { id: 1, type: 'message', content: 'Welcome message', delay: 0 },
    { id: 2, type: 'delay', content: '', delay: 3600 },
    { id: 3, type: 'message', content: 'Follow-up message', delay: 0 },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      type: 'message',
      content: '',
      delay: 0,
    };
    setWorkflowSteps(prev => [...prev, newStep]);
  };

  const removeStep = (id: number) => {
    if (workflowSteps.length > 1) {
      setWorkflowSteps(prev => prev.filter(step => step.id !== id));
    }
  };

  const updateStep = (id: number, field: string, value: string | number) => {
    setWorkflowSteps(prev =>
      prev.map(step =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'delay':
        return <Clock className="h-4 w-4" />;
      case 'tag':
        return <Tag className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
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
        title: "Workflow Updated",
        description: `Workflow "${formData.name}" has been updated successfully.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Editing Workflow</h3>
            <p className="text-sm text-blue-700 mt-1">
              ID: {workflow.id} • Created: {workflow.createdAt}
            </p>
          </div>
          <div className="text-right">
            <Badge variant={workflow.status === 'Active' ? 'default' : 'secondary'}>
              {workflow.status}
            </Badge>
            <div className="text-xs text-blue-700 mt-1">
              {workflow.totalRuns} runs • {workflow.completionRate}% completion
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workflow-name">Workflow Name *</Label>
          <Input
            id="workflow-name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter workflow name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trigger">Trigger Event *</Label>
          <Select
            value={formData.trigger}
            onValueChange={(value) => handleInputChange('trigger', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New Contact Added">New Contact Added</SelectItem>
              <SelectItem value="Tag Added">Tag Added</SelectItem>
              <SelectItem value="Cart Abandoned">Cart Abandoned</SelectItem>
              <SelectItem value="Birthday Date">Birthday Date</SelectItem>
              <SelectItem value="Purchase Made">Purchase Made</SelectItem>
              <SelectItem value="Form Submitted">Form Submitted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe what this workflow does..."
          rows={3}
        />
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Workflow Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={step.type}
                    onValueChange={(value) => updateStep(step.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">Send Message</SelectItem>
                      <SelectItem value="delay">Add Delay</SelectItem>
                      <SelectItem value="tag">Add Tag</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {step.type === 'message' && (
                    <Input
                      value={step.content}
                      onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                      placeholder="Message content or template"
                      className="md:col-span-2"
                    />
                  )}
                  
                  {step.type === 'delay' && (
                    <Input
                      type="number"
                      value={step.delay}
                      onChange={(e) => updateStep(step.id, 'delay', parseInt(e.target.value) || 0)}
                      placeholder="Delay in seconds"
                      className="md:col-span-2"
                    />
                  )}
                  
                  {step.type === 'tag' && (
                    <Input
                      value={step.content}
                      onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                      placeholder="Tag name"
                      className="md:col-span-2"
                    />
                  )}
                </div>
                
                {workflowSteps.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeStep(step.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addStep}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardContent>
      </Card>

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

export default AutomationEditModal;
