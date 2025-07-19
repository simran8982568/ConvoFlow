import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    messages: number;
    contacts: number;
    templates: number;
    phoneNumbers: number;
  };
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subscriberCount: number;
}

interface PlansState {
  plans: Plan[];
  selectedPlan: Plan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
};

export const fetchPlans = createAsyncThunk(
  'superadmin/plans/fetchPlans',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockPlans: Plan[] = [
      {
        id: '1',
        name: 'Starter',
        description: 'Perfect for small businesses getting started with WhatsApp marketing',
        price: 29,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          '2,000 messages per month',
          '1,000 contacts',
          '10 templates',
          '1 phone number',
          'Basic analytics',
          'Email support',
        ],
        limits: {
          messages: 2000,
          contacts: 1000,
          templates: 10,
          phoneNumbers: 1,
        },
        isPopular: false,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        subscriberCount: 567,
      },
      {
        id: '2',
        name: 'Professional',
        description: 'Ideal for growing businesses with advanced marketing needs',
        price: 99,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          '10,000 messages per month',
          '5,000 contacts',
          '50 templates',
          '3 phone numbers',
          'Advanced analytics',
          'Automation workflows',
          'Priority support',
        ],
        limits: {
          messages: 10000,
          contacts: 5000,
          templates: 50,
          phoneNumbers: 3,
        },
        isPopular: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        subscriberCount: 456,
      },
      {
        id: '3',
        name: 'Enterprise',
        description: 'For large organizations with custom requirements',
        price: 299,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          'Unlimited messages',
          'Unlimited contacts',
          'Unlimited templates',
          '10 phone numbers',
          'Custom analytics',
          'Advanced automation',
          'Dedicated support',
          'Custom integrations',
        ],
        limits: {
          messages: -1, // -1 means unlimited
          contacts: -1,
          templates: -1,
          phoneNumbers: 10,
        },
        isPopular: false,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        subscriberCount: 133,
      },
    ];
    
    return mockPlans;
  }
);

export const createPlan = createAsyncThunk(
  'superadmin/plans/createPlan',
  async (planData: Partial<Plan>) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: planData.name || 'New Plan',
      description: planData.description || '',
      price: planData.price || 0,
      currency: 'USD',
      billingCycle: planData.billingCycle || 'monthly',
      features: planData.features || [],
      limits: planData.limits || {
        messages: 1000,
        contacts: 500,
        templates: 5,
        phoneNumbers: 1,
      },
      isPopular: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscriberCount: 0,
    };
    
    return newPlan;
  }
);

export const updatePlan = createAsyncThunk(
  'superadmin/plans/updatePlan',
  async ({ id, updates }: { id: string; updates: Partial<Plan> }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, updates };
  }
);

export const deletePlan = createAsyncThunk(
  'superadmin/plans/deletePlan',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return id;
  }
);

const plansSlice = createSlice({
  name: 'superadminPlans',
  initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch plans';
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = { ...state.plans[index], ...action.payload.updates };
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(p => p.id !== action.payload);
      });
  },
});

export const { setSelectedPlan, clearError } = plansSlice.actions;
export default plansSlice.reducer;
