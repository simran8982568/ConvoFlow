import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  status: 'active' | 'blocked' | 'unsubscribed';
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
  source: 'manual' | 'import' | 'api' | 'chat';
  notes?: string;
}

interface ContactsState {
  contacts: Contact[];
  selectedContacts: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    tags: string[];
    source: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  importStatus: {
    isImporting: boolean;
    progress: number;
    errors: string[];
  };
}

const initialState: ContactsState = {
  contacts: [],
  selectedContacts: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    tags: [],
    source: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  importStatus: {
    isImporting: false,
    progress: 0,
    errors: [],
  },
};

// Async thunks
export const fetchContacts = createAsyncThunk(
  'admin/contacts/fetchContacts',
  async (params: { page?: number; limit?: number; filters?: any } = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        tags: ['customer', 'vip'],
        status: 'active',
        lastMessageAt: '2024-01-20T10:30:00Z',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        source: 'manual',
        notes: 'High-value customer, prefers morning communications',
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+1234567891',
        email: 'jane@example.com',
        tags: ['prospect', 'interested'],
        status: 'active',
        lastMessageAt: '2024-01-19T15:45:00Z',
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-19T15:45:00Z',
        source: 'import',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        phone: '+1234567892',
        tags: ['customer'],
        status: 'unsubscribed',
        createdAt: '2024-01-05T11:15:00Z',
        updatedAt: '2024-01-18T09:30:00Z',
        source: 'chat',
      },
    ];
    
    return {
      contacts: mockContacts,
      total: mockContacts.length,
    };
  }
);

export const createContact = createAsyncThunk(
  'admin/contacts/createContact',
  async (contactData: Partial<Contact>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newContact: Contact = {
      id: Date.now().toString(),
      name: contactData.name || 'New Contact',
      phone: contactData.phone || '',
      email: contactData.email,
      tags: contactData.tags || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual',
      notes: contactData.notes,
    };
    
    return newContact;
  }
);

export const updateContact = createAsyncThunk(
  'admin/contacts/updateContact',
  async ({ id, updates }: { id: string; updates: Partial<Contact> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { id, updates: { ...updates, updatedAt: new Date().toISOString() } };
  }
);

export const deleteContact = createAsyncThunk(
  'admin/contacts/deleteContact',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return id;
  }
);

export const importContacts = createAsyncThunk(
  'admin/contacts/importContacts',
  async (file: File, { dispatch }) => {
    // Simulate file processing
    dispatch(setImportProgress(0));
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      dispatch(setImportProgress(i));
    }
    
    // Mock imported contacts
    const importedContacts: Contact[] = [
      {
        id: 'imp1',
        name: 'Imported Contact 1',
        phone: '+1111111111',
        email: 'imported1@example.com',
        tags: ['imported'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'import',
      },
      {
        id: 'imp2',
        name: 'Imported Contact 2',
        phone: '+1111111112',
        tags: ['imported'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'import',
      },
    ];
    
    return importedContacts;
  }
);

export const exportContacts = createAsyncThunk(
  'admin/contacts/exportContacts',
  async (format: 'csv' | 'xlsx' = 'csv') => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would generate and download the file
    const exportData = {
      filename: `contacts_export_${new Date().toISOString().split('T')[0]}.${format}`,
      count: 150, // Mock count
    };
    
    return exportData;
  }
);

const contactsSlice = createSlice({
  name: 'adminContacts',
  initialState,
  reducers: {
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const index = state.selectedContacts.indexOf(contactId);
      if (index > -1) {
        state.selectedContacts.splice(index, 1);
      } else {
        state.selectedContacts.push(contactId);
      }
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setImportProgress: (state, action: PayloadAction<number>) => {
      state.importStatus.progress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetImportStatus: (state) => {
      state.importStatus = {
        isImporting: false,
        progress: 0,
        errors: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload.contacts;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      // Create contact
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.unshift(action.payload);
        state.pagination.total += 1;
      })
      // Update contact
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = { ...state.contacts[index], ...action.payload.updates };
        }
      })
      // Delete contact
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload);
        state.pagination.total -= 1;
      })
      // Import contacts
      .addCase(importContacts.pending, (state) => {
        state.importStatus.isImporting = true;
        state.importStatus.errors = [];
      })
      .addCase(importContacts.fulfilled, (state, action) => {
        state.importStatus.isImporting = false;
        state.contacts = [...action.payload, ...state.contacts];
        state.pagination.total += action.payload.length;
      })
      .addCase(importContacts.rejected, (state, action) => {
        state.importStatus.isImporting = false;
        state.importStatus.errors.push(action.error.message || 'Import failed');
      });
  },
});

export const {
  setSelectedContacts,
  toggleContactSelection,
  setFilters,
  setPagination,
  setImportProgress,
  clearError,
  resetImportStatus,
} = contactsSlice.actions;

export default contactsSlice.reducer;
