import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Template {
  id: string;
  name: string;
  category: string;
  type: 'text' | 'image' | 'video' | 'document';
  status: 'approved' | 'pending' | 'rejected';
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
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  language: string;
}

interface TemplatesState {
  templates: Template[];
  selectedTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    status: string;
    type: string;
    search: string;
  };
  previewTemplate: Template | null;
}

const initialState: TemplatesState = {
  templates: [],
  selectedTemplate: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    status: 'all',
    type: 'all',
    search: '',
  },
  previewTemplate: null,
};

export const fetchTemplates = createAsyncThunk(
  'admin/templates/fetchTemplates',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Welcome Message',
        category: 'onboarding',
        type: 'text',
        status: 'approved',
        content: {
          body: 'Welcome to ConvoFlow! 🎉 We\'re excited to have you on board. Get ready to revolutionize your WhatsApp marketing!',
          buttons: [
            { type: 'quick_reply', text: 'Get Started', value: 'get_started' },
            { type: 'url', text: 'Learn More', value: 'https://convoflow.com/guide' }
          ]
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        usageCount: 245,
        language: 'en',
      },
      {
        id: '2',
        name: 'Product Launch',
        category: 'marketing',
        type: 'image',
        status: 'approved',
        content: {
          header: '🚀 New Product Alert!',
          body: 'Introducing our latest WhatsApp automation features. Boost your marketing campaigns with advanced targeting and analytics.',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            filename: 'product-launch.jpg'
          },
          buttons: [
            { type: 'url', text: 'View Features', value: 'https://convoflow.com/features' }
          ]
        },
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-18T14:30:00Z',
        usageCount: 89,
        language: 'en',
      },
    ];
    
    return mockTemplates;
  }
);

export const createTemplate = createAsyncThunk(
  'admin/templates/createTemplate',
  async (templateData: Partial<Template>) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateData.name || 'New Template',
      category: templateData.category || 'general',
      type: templateData.type || 'text',
      status: 'pending',
      content: templateData.content || { body: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      language: 'en',
    };
    
    return newTemplate;
  }
);

export const updateTemplate = createAsyncThunk(
  'admin/templates/updateTemplate',
  async ({ id, updates }: { id: string; updates: Partial<Template> }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, updates };
  }
);

export const deleteTemplate = createAsyncThunk(
  'admin/templates/deleteTemplate',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return id;
  }
);

const templatesSlice = createSlice({
  name: 'adminTemplates',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<Template | null>) => {
      state.selectedTemplate = action.payload;
    },
    setPreviewTemplate: (state, action: PayloadAction<Template | null>) => {
      state.previewTemplate = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templates.unshift(action.payload);
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = { ...state.templates[index], ...action.payload.updates };
        }
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
      });
  },
});

export const { setSelectedTemplate, setPreviewTemplate, setFilters, clearError } = templatesSlice.actions;
export default templatesSlice.reducer;
