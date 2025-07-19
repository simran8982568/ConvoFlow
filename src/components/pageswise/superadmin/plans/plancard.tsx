import React from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (planId: number) => void;
  loading?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onEdit, 
  onToggleStatus, 
  loading = false 
}) => {
  if (loading) {
    return (
      <Card className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            <div className="space-y-1">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-3 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
            <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`relative ${!plan.isActive ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <Badge variant={plan.isActive ? "default" : "secondary"}>
            {plan.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="text-3xl font-bold text-teal-600">
          ₹{plan.price.toLocaleString()}
          <span className="text-sm font-normal text-gray-600">/month</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Messages</span>
            <span className="font-medium">{plan.messageQuota.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Automations</span>
            <span className="font-medium">{plan.automationLimit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Contacts</span>
            <span className="font-medium">{plan.contactLimit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subscribers</span>
            <span className="font-medium text-blue-600">{plan.subscribers}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Features:</div>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1"
            disabled={loading}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant={plan.isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => onToggleStatus(plan.id)}
            className="flex-1"
            disabled={loading}
          >
            {plan.isActive ? (
              <>
                <X className="h-3 w-3 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Check className="h-3 w-3 mr-1" />
                Activate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
