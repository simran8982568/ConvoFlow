import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  lastMessage: Message;
  unreadCount: number;
  status: 'open' | 'closed' | 'pending';
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface InboxState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    assignedTo: string;
    tags: string[];
  };
}

const initialState: InboxState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    assignedTo: 'all',
    tags: [],
  },
};

export const fetchConversations = createAsyncThunk(
  'admin/inbox/fetchConversations',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockConversations: Conversation[] = [
      {
        id: '1',
        contactId: 'c1',
        contactName: 'John Doe',
        contactPhone: '+1234567890',
        lastMessage: {
          id: 'm1',
          conversationId: '1',
          content: 'Hi, I need help with my order',
          type: 'text',
          direction: 'inbound',
          timestamp: '2024-01-20T10:30:00Z',
          status: 'delivered',
        },
        unreadCount: 2,
        status: 'open',
        tags: ['support', 'urgent'],
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
      },
    ];
    
    return mockConversations;
  }
);

const inboxSlice = createSlice({
  name: 'adminInbox',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      });
  },
});

export default inboxSlice.reducer;
