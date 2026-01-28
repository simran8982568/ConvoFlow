// Mock data for flows - easily removable when connecting to real API
export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  triggers?: string[];
}

export const dummyFlows: Flow[] = [
  {
    id: '1',
    name: 'Welcome Flow',
    description: 'Greet new customers and show options',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    triggers: ['hi', 'hello', 'hey'],
    nodes: [
      {
        id: 'start-1',
        type: 'flowStart',
        position: { x: 100, y: 100 },
        data: {
          label: 'Flow Start',
          triggers: ['hi', 'hello', 'hey'],
        },
      },
      {
        id: 'message-1',
        type: 'message',
        position: { x: 100, y: 250 },
        data: {
          label: 'Welcome Message',
          text: 'Welcome to Urban Studioz 🎨 Select from options below',
          buttons: [
            { id: 'btn-1', text: 'Shop Now', action: 'next' },
            { id: 'btn-2', text: 'Track Order', action: 'next' },
            { id: 'btn-3', text: 'Talk to Agent', action: 'next' },
          ],
        },
      },
    ],
    edges: [
      {
        id: 'e-start-1-message-1',
        source: 'start-1',
        target: 'message-1',
        type: 'smoothstep',
      },
    ],
  },
  {
    id: '2',
    name: 'Support Flow',
    description: 'Handle customer support queries',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    triggers: ['help', 'support', 'issue'],
    nodes: [
      {
        id: 'start-2',
        type: 'flowStart',
        position: { x: 100, y: 100 },
        data: {
          label: 'Flow Start',
          triggers: ['help', 'support', 'issue'],
        },
      },
      {
        id: 'message-2',
        type: 'message',
        position: { x: 100, y: 250 },
        data: {
          label: 'Support Options',
          text: 'How can we help you today?',
          buttons: [
            { id: 'btn-1', text: 'Technical Issue', action: 'next' },
            { id: 'btn-2', text: 'Billing Question', action: 'next' },
          ],
        },
      },
    ],
    edges: [
      {
        id: 'e-start-2-message-2',
        source: 'start-2',
        target: 'message-2',
        type: 'smoothstep',
      },
    ],
  },
  {
    id: '3',
    name: 'Order Tracking',
    description: 'Track order status',
    status: 'draft',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z',
    triggers: ['track', 'order', 'status'],
    nodes: [
      {
        id: 'start-3',
        type: 'flowStart',
        position: { x: 100, y: 100 },
        data: {
          label: 'Flow Start',
          triggers: ['track', 'order', 'status'],
        },
      },
    ],
    edges: [],
  },
];

export const createEmptyFlow = (): Omit<Flow, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: 'New Flow',
  description: '',
  status: 'draft',
  triggers: [],
  nodes: [],
  edges: [],
});