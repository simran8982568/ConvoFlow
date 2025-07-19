import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AnalyticsData {
  overview: {
    totalMessages: number;
    deliveredMessages: number;
    readMessages: number;
    repliedMessages: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
  };
  campaignPerformance: Array<{
    id: string;
    name: string;
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    sent: number;
    delivered: number;
    read: number;
    replied: number;
  }>;
  topPerformingTemplates: Array<{
    id: string;
    name: string;
    usageCount: number;
    readRate: number;
    replyRate: number;
  }>;
  audienceInsights: {
    totalContacts: number;
    activeContacts: number;
    newContacts: number;
    unsubscribed: number;
    topTags: Array<{ tag: string; count: number }>;
  };
}

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  dateRange: {
    start: string;
    end: string;
  };
}

const initialState: AnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
};

export const fetchAnalytics = createAsyncThunk(
  'admin/analytics/fetchAnalytics',
  async (dateRange: { start: string; end: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockData: AnalyticsData = {
      overview: {
        totalMessages: 15420,
        deliveredMessages: 14890,
        readMessages: 12340,
        repliedMessages: 1890,
        deliveryRate: 96.6,
        readRate: 82.9,
        replyRate: 12.3,
      },
      campaignPerformance: [
        {
          id: '1',
          name: 'Welcome Series',
          sent: 1250,
          delivered: 1200,
          read: 980,
          replied: 45,
          deliveryRate: 96.0,
          readRate: 78.4,
          replyRate: 3.6,
        },
        {
          id: '2',
          name: 'Product Launch',
          sent: 3500,
          delivered: 3420,
          read: 2890,
          replied: 156,
          deliveryRate: 97.7,
          readRate: 82.6,
          replyRate: 4.5,
        },
      ],
      timeSeriesData: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          sent: Math.floor(Math.random() * 500) + 200,
          delivered: Math.floor(Math.random() * 480) + 190,
          read: Math.floor(Math.random() * 400) + 150,
          replied: Math.floor(Math.random() * 50) + 10,
        };
      }),
      topPerformingTemplates: [
        {
          id: '1',
          name: 'Welcome Message',
          usageCount: 245,
          readRate: 85.2,
          replyRate: 8.9,
        },
        {
          id: '2',
          name: 'Product Launch',
          usageCount: 89,
          readRate: 78.4,
          replyRate: 12.1,
        },
      ],
      audienceInsights: {
        totalContacts: 5420,
        activeContacts: 4890,
        newContacts: 234,
        unsubscribed: 89,
        topTags: [
          { tag: 'customer', count: 2340 },
          { tag: 'prospect', count: 1890 },
          { tag: 'vip', count: 456 },
          { tag: 'interested', count: 234 },
        ],
      },
    };
    
    return mockData;
  }
);

const analyticsSlice = createSlice({
  name: 'adminAnalytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export const { setDateRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;
