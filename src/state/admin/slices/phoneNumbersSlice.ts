import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface PhoneNumber {
  id: string;
  number: string;
  displayName: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  businessAccountId: string;
  webhookUrl?: string;
  lastActivity?: string;
  messagesSent: number;
  messagesReceived: number;
  createdAt: string;
  updatedAt: string;
  config: {
    autoReply: boolean;
    businessHours: {
      enabled: boolean;
      timezone: string;
      schedule: Record<string, { start: string; end: string; enabled: boolean }>;
    };
    webhookEvents: string[];
  };
}

interface PhoneNumbersState {
  phoneNumbers: PhoneNumber[];
  selectedPhoneNumber: PhoneNumber | null;
  isLoading: boolean;
  error: string | null;
  testResults: Record<string, { status: 'success' | 'error'; message: string }>;
}

const initialState: PhoneNumbersState = {
  phoneNumbers: [],
  selectedPhoneNumber: null,
  isLoading: false,
  error: null,
  testResults: {},
};

export const fetchPhoneNumbers = createAsyncThunk(
  'admin/phoneNumbers/fetchPhoneNumbers',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockPhoneNumbers: PhoneNumber[] = [
      {
        id: '1',
        number: '+1234567890',
        displayName: 'Main Business Line',
        status: 'connected',
        businessAccountId: 'ba123',
        webhookUrl: 'https://api.ayuchat.com/webhook/whatsapp',
        lastActivity: '2024-01-20T10:30:00Z',
        messagesSent: 1250,
        messagesReceived: 890,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        config: {
          autoReply: true,
          businessHours: {
            enabled: true,
            timezone: 'America/New_York',
            schedule: {
              monday: { start: '09:00', end: '17:00', enabled: true },
              tuesday: { start: '09:00', end: '17:00', enabled: true },
              wednesday: { start: '09:00', end: '17:00', enabled: true },
              thursday: { start: '09:00', end: '17:00', enabled: true },
              friday: { start: '09:00', end: '17:00', enabled: true },
              saturday: { start: '10:00', end: '14:00', enabled: false },
              sunday: { start: '10:00', end: '14:00', enabled: false },
            },
          },
          webhookEvents: ['messages', 'message_status', 'contacts'],
        },
      },
    ];
    
    return mockPhoneNumbers;
  }
);

export const testConnection = createAsyncThunk(
  'admin/phoneNumbers/testConnection',
  async (phoneNumberId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock test result
    const success = Math.random() > 0.2; // 80% success rate
    
    return {
      phoneNumberId,
      result: {
        status: success ? 'success' : 'error',
        message: success 
          ? 'Connection test successful. WhatsApp Business API is responding correctly.'
          : 'Connection test failed. Please check your webhook configuration.',
      },
    };
  }
);

const phoneNumbersSlice = createSlice({
  name: 'adminPhoneNumbers',
  initialState,
  reducers: {
    clearTestResults: (state) => {
      state.testResults = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhoneNumbers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPhoneNumbers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phoneNumbers = action.payload;
      })
      .addCase(fetchPhoneNumbers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch phone numbers';
      })
      .addCase(testConnection.fulfilled, (state, action) => {
        state.testResults[action.payload.phoneNumberId] = action.payload.result;
      });
  },
});

export const { clearTestResults } = phoneNumbersSlice.actions;
export default phoneNumbersSlice.reducer;
