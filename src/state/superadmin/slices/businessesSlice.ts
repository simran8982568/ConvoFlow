import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastActivity: string;
  monthlyUsage: {
    messagesSent: number;
    messagesLimit: number;
    contactsCount: number;
    contactsLimit: number;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  billing: {
    amount: number;
    currency: string;
    nextBillingDate: string;
    paymentStatus: 'paid' | 'pending' | 'overdue';
  };
}

interface BusinessesState {
  businesses: Business[];
  selectedBusiness: Business | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    plan: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: BusinessesState = {
  businesses: [],
  selectedBusiness: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    plan: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

export const fetchBusinesses = createAsyncThunk(
  'superadmin/businesses/fetchBusinesses',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockBusinesses: Business[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        email: 'admin@techcorp.com',
        phone: '+1234567890',
        industry: 'Technology',
        plan: 'professional',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        lastActivity: '2024-01-20T15:30:00Z',
        monthlyUsage: {
          messagesSent: 8500,
          messagesLimit: 10000,
          contactsCount: 2340,
          contactsLimit: 5000,
        },
        owner: {
          name: 'John Smith',
          email: 'john@techcorp.com',
          phone: '+1234567890',
        },
        billing: {
          amount: 99,
          currency: 'USD',
          nextBillingDate: '2024-02-15T00:00:00Z',
          paymentStatus: 'paid',
        },
      },
      {
        id: '2',
        name: 'Fashion Boutique',
        email: 'info@fashionboutique.com',
        phone: '+1234567891',
        industry: 'Retail',
        plan: 'starter',
        status: 'active',
        createdAt: '2024-01-10T09:00:00Z',
        lastActivity: '2024-01-19T12:15:00Z',
        monthlyUsage: {
          messagesSent: 1200,
          messagesLimit: 2000,
          contactsCount: 450,
          contactsLimit: 1000,
        },
        owner: {
          name: 'Sarah Johnson',
          email: 'sarah@fashionboutique.com',
          phone: '+1234567891',
        },
        billing: {
          amount: 29,
          currency: 'USD',
          nextBillingDate: '2024-02-10T00:00:00Z',
          paymentStatus: 'paid',
        },
      },
    ];
    
    return {
      businesses: mockBusinesses,
      total: mockBusinesses.length,
    };
  }
);

export const exportBusinesses = createAsyncThunk(
  'superadmin/businesses/exportBusinesses',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      filename: `businesses_export_${new Date().toISOString().split('T')[0]}.csv`,
      count: 150,
    };
  }
);

const businessesSlice = createSlice({
  name: 'superadminBusinesses',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload.businesses;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      });
  },
});

export const { setFilters, setPagination } = businessesSlice.actions;
export default businessesSlice.reducer;
