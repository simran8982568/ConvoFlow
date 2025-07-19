import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin';
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

interface SuperAdminAuthState {
  user: SuperAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: SuperAdminAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

export const loginSuperAdmin = createAsyncThunk(
  'superadmin/auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hardcoded credentials check
      if (credentials.email === 'superadmin@ayuchat.com' && credentials.password === 'superadmin123') {
        const mockUser: SuperAdminUser = {
          id: 'superadmin-1',
          email: credentials.email,
          name: 'Super Administrator',
          role: 'superadmin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          permissions: ['all'],
          lastLogin: new Date().toISOString(),
        };
        
        const mockToken = 'superadmin-jwt-token-' + Date.now();
        
        return { user: mockUser, token: mockToken };
      } else {
        throw new Error('Invalid superadmin credentials');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const logoutSuperAdmin = createAsyncThunk(
  'superadmin/auth/logout',
  async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    return null;
  }
);

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<SuperAdminUser>) => {
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
      .addCase(loginSuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutSuperAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearUser } = superAdminAuthSlice.actions;
export default superAdminAuthSlice.reducer;
