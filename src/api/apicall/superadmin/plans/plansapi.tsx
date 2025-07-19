import { useToast } from '@/hooks/use-toast';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    messages: number;
    contacts: number;
    campaigns: number;
    automations: number;
    templates: number;
  };
  isActive: boolean;
  isPopular: boolean;
  subscribers: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanStats {
  totalPlans: number;
  activePlans: number;
  totalSubscribers: number;
  totalRevenue: number;
  averageRevenue: number;
  conversionRate: number;
  churnRate: number;
  mostPopularPlan: string;
}

export interface PlanFormData {
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    messages: number;
    contacts: number;
    campaigns: number;
    automations: number;
    templates: number;
  };
  isActive: boolean;
  isPopular: boolean;
}

export const usePlansAPI = () => {
  const { toast } = useToast();

  const fetchPlans = async (): Promise<Plan[]> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/plans');
      // if (!response.ok) throw new Error('Failed to fetch plans');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      return [
        {
          id: 'plan-1',
          name: 'Free',
          description: 'Perfect for getting started with basic messaging',
          price: 0,
          billingCycle: 'monthly',
          features: [
            '100 messages per month',
            '50 contacts',
            '1 campaign',
            'Basic templates',
            'Email support'
          ],
          limits: {
            messages: 100,
            contacts: 50,
            campaigns: 1,
            automations: 0,
            templates: 5
          },
          isActive: true,
          isPopular: false,
          subscribers: 450,
          revenue: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-01T00:00:00Z'
        },
        {
          id: 'plan-2',
          name: 'Starter',
          description: 'Ideal for small businesses and growing teams',
          price: 29,
          billingCycle: 'monthly',
          features: [
            '1,000 messages per month',
            '500 contacts',
            '5 campaigns',
            '2 automations',
            'Custom templates',
            'Priority email support',
            'Basic analytics'
          ],
          limits: {
            messages: 1000,
            contacts: 500,
            campaigns: 5,
            automations: 2,
            templates: 20
          },
          isActive: true,
          isPopular: true,
          subscribers: 320,
          revenue: 9280,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-01T00:00:00Z'
        },
        {
          id: 'plan-3',
          name: 'Pro',
          description: 'Advanced features for professional marketers',
          price: 99,
          billingCycle: 'monthly',
          features: [
            '10,000 messages per month',
            '5,000 contacts',
            'Unlimited campaigns',
            '10 automations',
            'Advanced templates',
            'Phone & email support',
            'Advanced analytics',
            'A/B testing',
            'Custom integrations'
          ],
          limits: {
            messages: 10000,
            contacts: 5000,
            campaigns: -1, // unlimited
            automations: 10,
            templates: 100
          },
          isActive: true,
          isPopular: false,
          subscribers: 280,
          revenue: 27720,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-01T00:00:00Z'
        },
        {
          id: 'plan-4',
          name: 'Enterprise',
          description: 'Complete solution for large organizations',
          price: 299,
          billingCycle: 'monthly',
          features: [
            'Unlimited messages',
            'Unlimited contacts',
            'Unlimited campaigns',
            'Unlimited automations',
            'Custom templates',
            'Dedicated account manager',
            'Enterprise analytics',
            'White-label options',
            'API access',
            'Custom integrations',
            'SLA guarantee'
          ],
          limits: {
            messages: -1, // unlimited
            contacts: -1, // unlimited
            campaigns: -1, // unlimited
            automations: -1, // unlimited
            templates: -1 // unlimited
          },
          isActive: true,
          isPopular: false,
          subscribers: 197,
          revenue: 58903,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-01T00:00:00Z'
        }
      ];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch plans. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchPlanStats = async (): Promise<PlanStats> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/plans/stats');
      // if (!response.ok) throw new Error('Failed to fetch plan stats');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for now
      return {
        totalPlans: 4,
        activePlans: 4,
        totalSubscribers: 1247,
        totalRevenue: 95903,
        averageRevenue: 76.93,
        conversionRate: 23.5,
        churnRate: 4.2,
        mostPopularPlan: 'Starter'
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch plan statistics. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createPlan = async (planData: PlanFormData): Promise<Plan> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/plans', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(planData)
      // });
      // if (!response.ok) throw new Error('Failed to create plan');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        ...planData,
        subscribers: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      toast({
        title: "Plan Created",
        description: `${planData.name} plan has been created successfully.`,
      });
      
      return newPlan;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePlan = async (planId: string, planData: Partial<PlanFormData>): Promise<Plan> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/superadmin/plans/${planId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(planData)
      // });
      // if (!response.ok) throw new Error('Failed to update plan');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock updated plan
      const updatedPlan: Plan = {
        id: planId,
        name: planData.name || 'Updated Plan',
        description: planData.description || 'Updated description',
        price: planData.price || 0,
        billingCycle: planData.billingCycle || 'monthly',
        features: planData.features || [],
        limits: planData.limits || {
          messages: 0,
          contacts: 0,
          campaigns: 0,
          automations: 0,
          templates: 0
        },
        isActive: planData.isActive ?? true,
        isPopular: planData.isPopular ?? false,
        subscribers: 0,
        revenue: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };
      
      toast({
        title: "Plan Updated",
        description: `Plan has been updated successfully.`,
      });
      
      return updatedPlan;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePlan = async (planId: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/superadmin/plans/${planId}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Failed to delete plan');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Plan Deleted",
        description: "Plan has been deleted successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const togglePlanStatus = async (planId: string, isActive: boolean): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/superadmin/plans/${planId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isActive })
      // });
      // if (!response.ok) throw new Error('Failed to toggle plan status');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Plan Status Updated",
        description: `Plan has been ${isActive ? 'activated' : 'deactivated'}.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchPlans,
    fetchPlanStats,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
  };
};
