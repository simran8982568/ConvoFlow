// Mock data for contact tags - easily removable when connecting to real API
export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
}

export const dummyTags: Tag[] = [
  {
    id: 'tag-1',
    name: 'VIP Customer',
    color: '#f59e0b', // amber-500
    description: 'High-value customers',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-2',
    name: 'Lead',
    color: '#3b82f6', // blue-500
    description: 'Potential customers',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-3',
    name: 'Support',
    color: '#ef4444', // red-500
    description: 'Customers needing support',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-4',
    name: 'Newsletter',
    color: '#8b5cf6', // violet-500
    description: 'Subscribed to newsletter',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-5',
    name: 'Inactive',
    color: '#6b7280', // gray-500
    description: 'Inactive customers',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-6',
    name: 'New Customer',
    color: '#10b981', // green-500
    description: 'Recently joined',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-7',
    name: 'Returning',
    color: '#14b8a6', // teal-500
    description: 'Repeat customers',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Helper function to get tag by ID
export const getTagById = (id: string): Tag | undefined => {
  return dummyTags.find((tag) => tag.id === id);
};

// Helper function to get tag by name
export const getTagByName = (name: string): Tag | undefined => {
  return dummyTags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
};