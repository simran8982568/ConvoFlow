import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface SuperAdminTemplate {
  id: string;
  name: string;
  category: string;
  type: 'text' | 'image' | 'video' | 'document';
  status: 'approved' | 'pending' | 'rejected';
  businessId: string;
  businessName: string;
  content: {
    header?: string;
    body: string;
    footer?: string;
    buttons?: Array<{
      type: 'url' | 'phone' | 'quick_reply';
      text: string;
      value: string;
    }>;
    media?: {
      type: 'image' | 'video' | 'document';
      url: string;
      filename?: string;
    };
  };
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  usageCount: number;
  language: string;
}

interface SuperAdminTemplatesState {
  templates: SuperAdminTemplate[];
  pendingTemplates: SuperAdminTemplate[];
  selectedTemplate: SuperAdminTemplate | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    business: string;
    category: string;
    search: string;
  };
}

const initialState: SuperAdminTemplatesState = {
  templates: [],
  pendingTemplates: [],
  selectedTemplate: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    business: 'all',
    category: 'all',
    search: '',
  },
};

export const fetchTemplates = createAsyncThunk(
  'superadmin/templates/fetchTemplates',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTemplates: SuperAdminTemplate[] = [
      {
        id: '1',
        name: 'Welcome Message',
        category: 'onboarding',
        type: 'text',
        status: 'approved', // SuperAdmin templates are auto-approved
        businessId: '1',
        businessName: 'TechCorp Solutions',
        content: {
          body: 'Welcome to TechCorp! We\'re excited to have you on board.',
        },
        submittedAt: '2024-01-20T10:00:00Z',
        reviewedAt: '2024-01-20T10:00:00Z', // Auto-approved immediately
        reviewedBy: 'SuperAdmin',
        usageCount: 0,
        language: 'en',
      },
    ];
    
    return mockTemplates;
  }
);

export const approveTemplate = createAsyncThunk(
  'superadmin/templates/approveTemplate',
  async (templateId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return templateId;
  }
);

export const rejectTemplate = createAsyncThunk(
  'superadmin/templates/rejectTemplate',
  async ({ templateId, reason }: { templateId: string; reason: string }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { templateId, reason };
  }
);

export const createSuperAdminTemplate = createAsyncThunk(
  'superadmin/templates/createTemplate',
  async (templateData: Partial<SuperAdminTemplate>) => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newTemplate: SuperAdminTemplate = {
      id: Date.now().toString(),
      name: templateData.name || 'New Template',
      category: templateData.category || 'general',
      type: templateData.type || 'text',
      status: 'approved', // SuperAdmin templates are auto-approved
      businessId: 'superadmin',
      businessName: 'SuperAdmin',
      content: templateData.content || { body: '' },
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(), // Auto-approved immediately
      reviewedBy: 'SuperAdmin',
      usageCount: 0,
      language: templateData.language || 'en',
    };

    return newTemplate;
  }
);

const superAdminTemplatesSlice = createSlice({
  name: 'superadminTemplates',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.pendingTemplates = action.payload.filter(t => t.status === 'pending');
      })
      .addCase(approveTemplate.fulfilled, (state, action) => {
        const template = state.templates.find(t => t.id === action.payload);
        if (template) {
          template.status = 'approved';
          template.reviewedAt = new Date().toISOString();
        }
      })
      .addCase(rejectTemplate.fulfilled, (state, action) => {
        const template = state.templates.find(t => t.id === action.payload.templateId);
        if (template) {
          template.status = 'rejected';
          template.reviewedAt = new Date().toISOString();
          template.rejectionReason = action.payload.reason;
        }
      })
      .addCase(createSuperAdminTemplate.fulfilled, (state, action) => {
        state.templates.unshift(action.payload); // Add to beginning of array
        // No need to add to pendingTemplates since it's auto-approved
      });
  },
});

export const { setFilters } = superAdminTemplatesSlice.actions;
export default superAdminTemplatesSlice.reducer;
