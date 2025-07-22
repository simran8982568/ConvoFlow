import { useState, useEffect } from 'react';

// Data interfaces
export interface Template {
  id: string;
  name: string;
  category: string;
  type: 'system' | 'custom';
  status: 'approved' | 'pending' | 'rejected';
  content: {
    header: string;
    body: string;
    footer: string;
    buttons: string[];
  };
  createdAt: string;
  usageCount?: number;
}

export interface TemplateStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface TemplatesData {
  templates: Template[];
  stats: TemplateStats;
}

export interface TemplatesDataState {
  data: TemplatesData;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export interface TemplateFilters {
  searchTerm: string;
  filterCategory: string;
  filterType: string;
}

// Mock data
const mockSystemTemplates: Template[] = [
  {
    id: 'sys_1',
    name: 'Welcome New Customer',
    category: 'Marketing',
    type: 'system',
    status: 'approved',
    content: {
      header: 'Welcome to {{business_name}}! 🎉',
      body: 'Hi {{customer_name}}, thank you for choosing our services. We are excited to help you grow your business.',
      footer: '{{business_name}} - Your Growth Partner',
      buttons: ['Get Started', 'Learn More']
    },
    createdAt: '2024-01-15',
    usageCount: 1250
  },
  {
    id: 'sys_2',
    name: 'Order Confirmation',
    category: 'Transactional',
    type: 'system',
    status: 'approved',
    content: {
      header: 'Order Confirmed ✅',
      body: 'Hi {{customer_name}}, your order #{{order_id}} has been confirmed. Total: {{amount}}. Expected delivery: {{delivery_date}}.',
      footer: 'Track your order anytime',
      buttons: ['Track Order', 'Contact Support']
    },
    createdAt: '2024-01-10',
    usageCount: 2100
  }
];

const mockUserTemplates: Template[] = [
  {
    id: 'user_1',
    name: 'Custom Welcome',
    category: 'Marketing',
    type: 'custom',
    status: 'pending',
    content: {
      header: 'Welcome! 👋',
      body: 'Thanks for joining us. We have special offers waiting for you.',
      footer: 'Best regards, Team',
      buttons: ['View Offers']
    },
    createdAt: '2024-03-10'
  }
];

const mockTemplatesData: TemplatesData = {
  templates: [...mockSystemTemplates, ...mockUserTemplates],
  stats: {
    total: 3,
    approved: 2,
    pending: 1,
    rejected: 0
  }
};

// Simulate API calls
const simulateAPICall = <T,>(data: T, delay: number = 800, errorRate: number = 0.05): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to fetch templates data'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for templates data management
export const useTemplatesData = () => {
  const [state, setState] = useState<TemplatesDataState>({
    data: mockTemplatesData,
    loading: true,
    error: null,
    refreshing: false
  });

  const [filters, setFilters] = useState<TemplateFilters>({
    searchTerm: '',
    filterCategory: 'all',
    filterType: 'all'
  });

  const fetchTemplatesData = async (isRefresh = false) => {
    setState(prev => ({ 
      ...prev, 
      loading: !isRefresh, 
      refreshing: isRefresh,
      error: null 
    }));

    try {
      const data = await simulateAPICall(mockTemplatesData, isRefresh ? 500 : 1000, 0.05);
      
      setState(prev => ({
        ...prev,
        data,
        loading: false,
        refreshing: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const updateFilters = (newFilters: Partial<TemplateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      filterCategory: 'all',
      filterType: 'all'
    });
  };

  const getFilteredTemplates = () => {
    return state.data.templates.filter(template => {
      const matchesSearch = !filters.searchTerm || 
                           template.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           template.content.body.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesCategory = filters.filterCategory === 'all' || template.category === filters.filterCategory;
      const matchesType = filters.filterType === 'all' || template.type === filters.filterType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  };

  const refreshData = () => {
    fetchTemplatesData(true);
  };

  const addTemplate = (templateData: Omit<Template, 'id' | 'createdAt' | 'usageCount'>) => {
    const newTemplate: Template = {
      ...templateData,
      id: `custom_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };

    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        templates: [...prev.data.templates, newTemplate],
        stats: {
          ...prev.data.stats,
          total: prev.data.stats.total + 1,
          pending: prev.data.stats.pending + 1,
        }
      }
    }));

    return newTemplate;
  };

  const deleteTemplate = (templateId: string) => {
    setState(prev => {
      const templateToDelete = prev.data.templates.find(t => t.id === templateId);
      if (!templateToDelete) return prev;

      const updatedTemplates = prev.data.templates.filter(t => t.id !== templateId);
      const updatedStats = { ...prev.data.stats };

      updatedStats.total -= 1;
      if (templateToDelete.status === 'approved') updatedStats.approved -= 1;
      if (templateToDelete.status === 'pending') updatedStats.pending -= 1;
      if (templateToDelete.status === 'rejected') updatedStats.rejected -= 1;

      return {
        ...prev,
        data: {
          ...prev.data,
          templates: updatedTemplates,
          stats: updatedStats
        }
      };
    });
  };

  useEffect(() => {
    fetchTemplatesData();
  }, []);

  return {
    ...state,
    filters,
    filteredTemplates: getFilteredTemplates(),
    updateFilters,
    clearFilters,
    refreshData,
    refetchData: () => fetchTemplatesData(),
    addTemplate,
    deleteTemplate
  };
};
