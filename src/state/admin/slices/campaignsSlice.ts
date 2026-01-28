import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'broadcast' | 'drip' | 'trigger';
  targetAudience: string;
  messageCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  completedAt?: string;
  template?: {
    id: string;
    name: string;
    preview: string;
  };
  analytics: {
    deliveryRate: number;
    readRate: number;
    replyRate: number;
    clickRate: number;
  };
}

interface CampaignsState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    type: string;
    dateRange: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: CampaignsState = {
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    dateRange: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async thunks
export const fetchCampaigns = createAsyncThunk(
  'admin/campaigns/fetchCampaigns',
  async (params: { page?: number; limit?: number; filters?: any } = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Welcome Series',
        description: 'Onboarding campaign for new customers',
        status: 'active',
        type: 'drip',
        targetAudience: 'New Customers',
        messageCount: 5,
        sentCount: 1250,
        deliveredCount: 1200,
        readCount: 980,
        replyCount: 45,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        template: {
          id: 't1',
          name: 'Welcome Template',
          preview: 'Welcome to ConvoFlow! We\'re excited to have you...'
        },
        analytics: {
          deliveryRate: 96,
          readRate: 78.4,
          replyRate: 3.6,
          clickRate: 12.5,
        },
      },
      {
        id: '2',
        name: 'Product Launch',
        description: 'Announcing our new WhatsApp automation features',
        status: 'paused',
        type: 'broadcast',
        targetAudience: 'All Customers',
        messageCount: 1,
        sentCount: 3500,
        deliveredCount: 3420,
        readCount: 2890,
        replyCount: 156,
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-18T11:45:00Z',
        template: {
          id: 't2',
          name: 'Product Launch Template',
          preview: '🚀 Exciting news! We\'ve just launched...'
        },
        analytics: {
          deliveryRate: 97.7,
          readRate: 82.6,
          replyRate: 4.5,
          clickRate: 18.2,
        },
      },
    ];
    
    return {
      campaigns: mockCampaigns,
      total: mockCampaigns.length,
    };
  }
);

export const createCampaign = createAsyncThunk(
  'admin/campaigns/createCampaign',
  async (campaignData: Partial<Campaign>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignData.name || 'New Campaign',
      description: campaignData.description || '',
      status: 'draft',
      type: campaignData.type || 'broadcast',
      targetAudience: campaignData.targetAudience || 'All Customers',
      messageCount: 0,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      replyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analytics: {
        deliveryRate: 0,
        readRate: 0,
        replyRate: 0,
        clickRate: 0,
      },
    };
    
    return newCampaign;
  }
);

export const updateCampaign = createAsyncThunk(
  'admin/campaigns/updateCampaign',
  async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { id, updates };
  }
);

export const deleteCampaign = createAsyncThunk(
  'admin/campaigns/deleteCampaign',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return id;
  }
);

export const pauseCampaign = createAsyncThunk(
  'admin/campaigns/pauseCampaign',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return id;
  }
);

export const resumeCampaign = createAsyncThunk(
  'admin/campaigns/resumeCampaign',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return id;
  }
);

const campaignsSlice = createSlice({
  name: 'adminCampaigns',
  initialState,
  reducers: {
    setSelectedCampaign: (state, action: PayloadAction<Campaign | null>) => {
      state.selectedCampaign = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload.campaigns;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      })
      // Create campaign
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.campaigns.unshift(action.payload);
      })
      // Update campaign
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = { ...state.campaigns[index], ...action.payload.updates };
        }
      })
      // Delete campaign
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
      })
      // Pause campaign
      .addCase(pauseCampaign.fulfilled, (state, action) => {
        const campaign = state.campaigns.find(c => c.id === action.payload);
        if (campaign) {
          campaign.status = 'paused';
        }
      })
      // Resume campaign
      .addCase(resumeCampaign.fulfilled, (state, action) => {
        const campaign = state.campaigns.find(c => c.id === action.payload);
        if (campaign) {
          campaign.status = 'active';
        }
      });
  },
});

export const { setSelectedCampaign, setFilters, setPagination, clearError } = campaignsSlice.actions;
export default campaignsSlice.reducer;
