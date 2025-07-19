import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface SuperAdminAnalytics {
  platformOverview: {
    totalBusinesses: number;
    activeBusinesses: number;
    totalMessages: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  businessMetrics: Array<{
    businessId: string;
    businessName: string;
    messagesSent: number;
    revenue: number;
    plan: string;
    status: string;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
    businesses: number;
  }>;
  planDistribution: Array<{
    plan: string;
    count: number;
    revenue: number;
  }>;
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeConnections: number;
  };
}

interface SuperAdminAnalyticsState {
  data: SuperAdminAnalytics | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    month: string;
    year: string;
  };
}

const initialState: SuperAdminAnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
  filters: {
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString(),
  },
};

export const fetchSuperAdminAnalytics = createAsyncThunk(
  'superadmin/analytics/fetchAnalytics',
  async (filters: { month: string; year: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockData: SuperAdminAnalytics = {
      platformOverview: {
        totalBusinesses: 1247,
        activeBusinesses: 1156,
        totalMessages: 2456789,
        totalRevenue: 89450,
        monthlyGrowth: 12.5,
      },
      businessMetrics: [
        {
          businessId: '1',
          businessName: 'TechCorp Solutions',
          messagesSent: 45000,
          revenue: 990,
          plan: 'professional',
          status: 'active',
        },
        {
          businessId: '2',
          businessName: 'Fashion Boutique',
          messagesSent: 12000,
          revenue: 290,
          plan: 'starter',
          status: 'active',
        },
      ],
      revenueData: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 30000,
        businesses: Math.floor(Math.random() * 100) + 50,
      })),
      planDistribution: [
        { plan: 'starter', count: 567, revenue: 16443 },
        { plan: 'professional', count: 456, revenue: 45144 },
        { plan: 'enterprise', count: 133, revenue: 27863 },
      ],
      systemHealth: {
        uptime: 99.9,
        responseTime: 145,
        errorRate: 0.02,
        activeConnections: 2456,
      },
    };
    
    return mockData;
  }
);

export const exportAnalyticsReport = createAsyncThunk(
  'superadmin/analytics/exportReport',
  async (filters: { month: string; year: string }) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      filename: `analytics_report_${filters.year}_${filters.month}.pdf`,
      size: '2.4 MB',
    };
  }
);

const superAdminAnalyticsSlice = createSlice({
  name: 'superadminAnalytics',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchSuperAdminAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export const { setFilters } = superAdminAnalyticsSlice.actions;
export default superAdminAnalyticsSlice.reducer;
