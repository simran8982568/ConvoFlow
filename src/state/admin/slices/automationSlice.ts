import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: {
    type: 'keyword' | 'time' | 'event';
    value: string;
    conditions?: any[];
  };
  actions: Array<{
    type: 'send_message' | 'add_tag' | 'delay' | 'condition';
    config: any;
  }>;
  createdAt: string;
  updatedAt: string;
  executionCount: number;
  successRate: number;
}

interface AutomationState {
  automations: Automation[];
  selectedAutomation: Automation | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AutomationState = {
  automations: [],
  selectedAutomation: null,
  isLoading: false,
  error: null,
};

export const fetchAutomations = createAsyncThunk(
  'admin/automation/fetchAutomations',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockAutomations: Automation[] = [
      {
        id: '1',
        name: 'Welcome Series',
        description: 'Automated welcome sequence for new subscribers',
        status: 'active',
        trigger: {
          type: 'keyword',
          value: 'START',
        },
        actions: [
          { type: 'send_message', config: { templateId: 'welcome-1' } },
          { type: 'delay', config: { duration: 3600 } },
          { type: 'send_message', config: { templateId: 'welcome-2' } },
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        executionCount: 156,
        successRate: 94.2,
      },
    ];
    
    return mockAutomations;
  }
);

const automationSlice = createSlice({
  name: 'adminAutomation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutomations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAutomations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.automations = action.payload;
      })
      .addCase(fetchAutomations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch automations';
      });
  },
});

export default automationSlice.reducer;
