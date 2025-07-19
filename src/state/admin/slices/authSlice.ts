import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  company: string;
  role: 'admin';
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AdminAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

// Async thunks
export const loginAdmin = createAsyncThunk(
  'admin/auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: AdminUser = {
        id: '1',
        email: credentials.email,
        name: 'Admin User',
        company: 'AyuChat Inc.',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        phone: '+1 (555) 123-4567',
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'admin-jwt-token-' + Date.now();
      
      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

export const signupAdmin = createAsyncThunk(
  'admin/auth/signup',
  async (userData: { name: string; email: string; company: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: AdminUser = {
        id: '1',
        email: userData.email,
        name: userData.name,
        company: userData.company,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'admin-jwt-token-' + Date.now();
      
      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue('Signup failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'admin/auth/logout',
  async () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    return null;
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Signup
      .addCase(signupAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearUser } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
