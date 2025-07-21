import { useState, useEffect } from 'react';

// Data interfaces
export interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  module: string;
  status: string;
  message: string;
  ip: string;
}

export interface LogsDataState {
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export interface LogsFilters {
  searchTerm: string;
  filterModule: string;
  filterStatus: string;
}

// Mock data with more realistic entries
const mockLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: '2024-03-15 14:30:25',
    action: 'Admin Login',
    module: 'Authentication',
    status: 'Success',
    message: 'Super admin user logged in successfully',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    timestamp: '2024-03-15 14:28:15',
    action: 'Campaign Create',
    module: 'Campaigns',
    status: 'Success',
    message: 'New campaign "Spring Sale 2024" created by Business ID: 1234',
    ip: '192.168.1.101'
  },
  {
    id: 3,
    timestamp: '2024-03-15 14:25:10',
    action: 'Template Approval',
    module: 'Templates',
    status: 'Success',
    message: 'Template "Welcome Message v2" approved for Business ID: 5678',
    ip: '10.0.0.1'
  },
  {
    id: 4,
    timestamp: '2024-03-15 14:22:45',
    action: 'Message Send',
    module: 'WhatsApp',
    status: 'Failed',
    message: 'Failed to send message to +91-9876543210 - Rate limit exceeded (429)',
    ip: '192.168.1.102'
  },
  {
    id: 5,
    timestamp: '2024-03-15 14:20:30',
    action: 'Plan Upgrade',
    module: 'Billing',
    status: 'Success',
    message: 'Business ID: 9012 upgraded from Starter to Pro plan',
    ip: '192.168.1.103'
  },
  {
    id: 6,
    timestamp: '2024-03-15 14:18:20',
    action: 'Automation Trigger',
    module: 'Automation',
    status: 'Success',
    message: 'Welcome automation triggered for new contact: John Doe (+91-9876543211)',
    ip: '192.168.1.100'
  },
  {
    id: 7,
    timestamp: '2024-03-15 14:15:55',
    action: 'Contact Import',
    module: 'Contacts',
    status: 'Failed',
    message: 'CSV import failed for Business ID: 3456 - Invalid phone format in row 15',
    ip: '192.168.1.104'
  },
  {
    id: 8,
    timestamp: '2024-03-15 14:12:30',
    action: 'Template Submit',
    module: 'Templates',
    status: 'Success',
    message: 'New template "Order Confirmation" submitted for approval by Business ID: 7890',
    ip: '192.168.1.105'
  },
  {
    id: 9,
    timestamp: '2024-03-15 14:10:15',
    action: 'Payment Failed',
    module: 'Billing',
    status: 'Failed',
    message: 'Payment failed for Business ID: 2468 - Insufficient funds',
    ip: '192.168.1.106'
  },
  {
    id: 10,
    timestamp: '2024-03-15 14:08:45',
    action: 'User Registration',
    module: 'Authentication',
    status: 'Success',
    message: 'New business registered: TechCorp Solutions (business@techcorp.com)',
    ip: '203.0.113.45'
  }
];

// Simulate API calls with delays and potential errors
const simulateAPICall = <T,>(data: T, delay: number = 800, errorRate: number = 0.05): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to fetch logs from server'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for logs data management
export const useLogsData = () => {
  const [state, setState] = useState<LogsDataState>({
    logs: [],
    loading: true,
    error: null,
    refreshing: false
  });

  const [filters, setFilters] = useState<LogsFilters>({
    searchTerm: '',
    filterModule: 'all',
    filterStatus: 'all'
  });

  const fetchLogs = async (isRefresh = false) => {
    setState(prev => ({ 
      ...prev, 
      loading: !isRefresh, 
      refreshing: isRefresh,
      error: null 
    }));

    try {
      // Simulate fetching logs with potential new entries
      const logs = await simulateAPICall(mockLogs, isRefresh ? 500 : 1000, 0.05);
      
      setState(prev => ({
        ...prev,
        logs,
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

  const updateFilters = (newFilters: Partial<LogsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      filterModule: 'all',
      filterStatus: 'all'
    });
  };

  const getFilteredLogs = () => {
    return state.logs.filter(log => {
      const matchesModule = filters.filterModule === 'all' || 
                           log.module.toLowerCase() === filters.filterModule;
      const matchesStatus = filters.filterStatus === 'all' || 
                           log.status.toLowerCase() === filters.filterStatus;
      const matchesSearch = !filters.searchTerm || 
                           log.action.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           log.message.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           log.module.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesModule && matchesStatus && matchesSearch;
    });
  };

  const refreshLogs = () => {
    fetchLogs(true);
  };

  const downloadLogs = async (format: 'csv' | 'json' = 'csv'): Promise<void> => {
    try {
      await simulateAPICall({ success: true }, 1500, 0.08);
      
      const filteredLogs = getFilteredLogs();
      
      if (format === 'csv') {
        const csvContent = [
          'Timestamp,Action,Module,Status,Message,IP',
          ...filteredLogs.map(log => 
            `"${log.timestamp}","${log.action}","${log.module}","${log.status}","${log.message}","${log.ip}"`
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(filteredLogs, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      console.log(`${format.toUpperCase()} logs downloaded successfully`);
    } catch (error) {
      throw new Error(`Failed to download logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    ...state,
    filters,
    filteredLogs: getFilteredLogs(),
    updateFilters,
    clearFilters,
    refreshLogs,
    downloadLogs,
    refetchLogs: () => fetchLogs()
  };
};
