import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface HeaderCardProps {
  plans: Plan[];
  loading?: boolean;
  error?: string | null;
}

const HeaderCard: React.FC<HeaderCardProps> = ({ plans, loading = false, error }) => {
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-4">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading plan statistics</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalPlans = plans.length;
  const activePlans = plans.filter(p => p.isActive).length;
  const totalSubscribers = plans.reduce((sum, p) => sum + p.subscribers, 0);
  const monthlyRevenue = plans.reduce((sum, p) => sum + (p.price * p.subscribers), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalPlans}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activePlans}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalSubscribers.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            ₹{monthlyRevenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderCard;
