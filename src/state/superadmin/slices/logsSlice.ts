import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'auth' | 'api' | 'webhook' | 'system' | 'business';
  message: string;
  details?: any;
  businessId?: string;
  businessName?: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface LogsState {
  logs: LogEntry[];
  isLoading: boolean;
  error: string | null;
  filters: {
    level: string;
    category: string;
    business: string;
    dateRange: {
      start: string;
      end: string;
    };
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: LogsState = {
  logs: [],
  isLoading: false,
  error: null,
  filters: {
    level: 'all',
    category: 'all',
    business: 'all',
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    search: '',
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
  },
};

export const fetchLogs = createAsyncThunk(
  'superadmin/logs/fetchLogs',
  async (params: { page?: number; filters?: any } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-20T15:30:00Z',
        level: 'info',
        category: 'auth',
        message: 'User login successful',
        businessId: '1',
        businessName: 'TechCorp Solutions',
        userId: 'user1',
        userEmail: 'john@techcorp.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: '2',
        timestamp: '2024-01-20T15:25:00Z',
        level: 'error',
        category: 'webhook',
        message: 'Webhook delivery failed',
        details: {
          webhookUrl: 'https://api.techcorp.com/webhook',
          statusCode: 500,
          retryCount: 3,
        },
        businessId: '1',
        businessName: 'TechCorp Solutions',
      },
      {
        id: '3',
        timestamp: '2024-01-20T15:20:00Z',
        level: 'warning',
        category: 'api',
        message: 'Rate limit approaching',
        details: {
          currentUsage: 950,
          limit: 1000,
          resetTime: '2024-01-20T16:00:00Z',
        },
        businessId: '2',
        businessName: 'Fashion Boutique',
      },
      {
        id: '4',
        timestamp: '2024-01-20T15:15:00Z',
        level: 'info',
        category: 'system',
        message: 'Database backup completed successfully',
        details: {
          backupSize: '2.5GB',
          duration: '45 minutes',
        },
      },
      {
        id: '5',
        timestamp: '2024-01-20T15:10:00Z',
        level: 'debug',
        category: 'business',
        message: 'Template approval workflow triggered',
        businessId: '1',
        businessName: 'TechCorp Solutions',
        details: {
          templateId: 'template123',
          templateName: 'Welcome Message',
          reviewerId: 'admin1',
        },
      },
    ];
    
    return {
      logs: mockLogs,
      total: mockLogs.length,
    };
  }
);

export const exportLogs = createAsyncThunk(
  'superadmin/logs/exportLogs',
  async (filters: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      filename: `system_logs_${new Date().toISOString().split('T')[0]}.csv`,
      count: 1250,
    };
  }
);

const logsSlice = createSlice({
  name: 'superadminLogs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload.logs;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch logs';
      });
  },
});

export const { setFilters, setPagination, clearError } = logsSlice.actions;
export default logsSlice.reducer;
