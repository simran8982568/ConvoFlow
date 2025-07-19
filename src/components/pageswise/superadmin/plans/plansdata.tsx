import { useState, useEffect } from 'react';

// Data interfaces
export interface Plan {
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

export interface PlanFormData {
  name: string;
  price: number;
  messageQuota: number;
  automationLimit: number;
  contactLimit: number;
  features: string[];
  isActive: boolean;
}

export interface PlansDataState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  saving: boolean;
}

// Mock data
const mockPlans: Plan[] = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    messageQuota: 100,
    automationLimit: 1,
    contactLimit: 100,
    features: ['Basic Templates', 'Manual Campaigns'],
    isActive: true,
    subscribers: 45
  },
  {
    id: 2,
    name: 'Starter',
    price: 999,
    messageQuota: 1000,
    automationLimit: 5,
    contactLimit: 1000,
    features: ['All Templates', 'Automation', 'Analytics', 'Support'],
    isActive: true,
    subscribers: 32
  },
  {
    id: 3,
    name: 'Pro',
    price: 2999,
    messageQuota: 5000,
    automationLimit: 20,
    contactLimit: 10000,
    features: ['Everything in Starter', 'Advanced Analytics', 'API Access', 'Priority Support'],
    isActive: true,
    subscribers: 18
  },
  {
    id: 4,
    name: 'Enterprise',
    price: 9999,
    messageQuota: 25000,
    automationLimit: 100,
    contactLimit: 100000,
    features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'SLA'],
    isActive: true,
    subscribers: 8
  }
];

// Simulate API calls with delays and potential errors
const simulateAPICall = <T,>(data: T, delay: number = 800, errorRate: number = 0.05): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to communicate with server'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for plans data management
export const usePlansData = () => {
  const [state, setState] = useState<PlansDataState>({
    plans: [],
    loading: true,
    error: null,
    saving: false
  });

  const fetchPlans = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const plans = await simulateAPICall(mockPlans, 1000, 0.05);
      setState(prev => ({
        ...prev,
        plans,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const createPlan = async (formData: PlanFormData): Promise<void> => {
    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      const newPlan: Plan = {
        ...formData,
        id: Math.max(...state.plans.map(p => p.id), 0) + 1,
        subscribers: 0
      };

      await simulateAPICall(newPlan, 1200, 0.08);

      setState(prev => ({
        ...prev,
        plans: [...prev.plans, newPlan],
        saving: false,
        error: null
      }));

      console.log('Created new plan:', newPlan);
    } catch (error) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to create plan'
      }));
      throw error;
    }
  };

  const updatePlan = async (planId: number, formData: PlanFormData): Promise<void> => {
    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      const updatedPlan = state.plans.find(p => p.id === planId);
      if (!updatedPlan) {
        throw new Error('Plan not found');
      }

      const newPlanData = { ...updatedPlan, ...formData };
      await simulateAPICall(newPlanData, 1000, 0.08);

      setState(prev => ({
        ...prev,
        plans: prev.plans.map(p => p.id === planId ? newPlanData : p),
        saving: false,
        error: null
      }));

      console.log('Updated plan:', newPlanData);
    } catch (error) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update plan'
      }));
      throw error;
    }
  };

  const togglePlanStatus = async (planId: number): Promise<void> => {
    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      const plan = state.plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      const updatedPlan = { ...plan, isActive: !plan.isActive };
      await simulateAPICall(updatedPlan, 600, 0.05);

      setState(prev => ({
        ...prev,
        plans: prev.plans.map(p => p.id === planId ? updatedPlan : p),
        saving: false,
        error: null
      }));

      console.log(`Toggled plan ${planId} status to ${updatedPlan.isActive ? 'active' : 'inactive'}`);
    } catch (error) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update plan status'
      }));
      throw error;
    }
  };

  const deletePlan = async (planId: number): Promise<void> => {
    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      await simulateAPICall({ success: true }, 800, 0.05);

      setState(prev => ({
        ...prev,
        plans: prev.plans.filter(p => p.id !== planId),
        saving: false,
        error: null
      }));

      console.log(`Deleted plan ${planId}`);
    } catch (error) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to delete plan'
      }));
      throw error;
    }
  };

  const refetchPlans = () => {
    fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    ...state,
    createPlan,
    updatePlan,
    togglePlanStatus,
    deletePlan,
    refetchPlans
  };
};
