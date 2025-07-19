import { useState, useEffect } from 'react';

// Data interfaces
export interface GrowthData {
  name: string;
  businesses: number;
  messages: number;
  campaigns: number;
}

export interface PlanData {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: number;
  event: string;
  business: string;
  time: string;
  type: 'registration' | 'template' | 'upgrade' | 'submission';
}

export interface AdminOverviewData {
  growthData: GrowthData[];
  planData: PlanData[];
  recentActivities: ActivityItem[];
}

export interface AdminDataState {
  data: AdminOverviewData;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

// Mock data
const mockGrowthData: GrowthData[] = [
  { name: "Jan", businesses: 45, messages: 125000, campaigns: 890 },
  { name: "Feb", businesses: 52, messages: 143000, campaigns: 1020 },
  { name: "Mar", businesses: 67, messages: 156000, campaigns: 1150 },
  { name: "Apr", businesses: 78, messages: 187000, campaigns: 1340 },
  { name: "May", businesses: 89, messages: 234000, campaigns: 1580 },
  { name: "Jun", businesses: 103, messages: 267000, campaigns: 1720 },
];

const mockPlanData: PlanData[] = [
  { name: "Free", value: 45, color: "#9ca3af" },
  { name: "Starter", value: 32, color: "#3b82f6" },
  { name: "Pro", value: 18, color: "#0d9488" },
  { name: "Enterprise", value: 8, color: "#7c3aed" },
];

const mockRecentActivities: ActivityItem[] = [
  {
    id: 1,
    event: "New business registered",
    business: "TechCorp Solutions",
    time: "2 hours ago",
    type: "registration"
  },
  {
    id: 2,
    event: "Template approved",
    business: "Marketing Pro",
    time: "4 hours ago",
    type: "template"
  },
  {
    id: 3,
    event: "Plan upgraded to Enterprise",
    business: "Global Retail",
    time: "6 hours ago",
    type: "upgrade"
  },
  {
    id: 4,
    event: "New business registered",
    business: "StartupXYZ",
    time: "8 hours ago",
    type: "registration"
  },
  {
    id: 5,
    event: "Template submitted for review",
    business: "E-commerce Plus",
    time: "12 hours ago",
    type: "submission"
  },
];

const mockAdminData: AdminOverviewData = {
  growthData: mockGrowthData,
  planData: mockPlanData,
  recentActivities: mockRecentActivities
};

// Simulate API calls with delays and potential errors
const simulateAPICall = <T,>(data: T, delay: number = 800, errorRate: number = 0.05): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to fetch admin overview data'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for admin data management
export const useAdminData = () => {
  const [state, setState] = useState<AdminDataState>({
    data: mockAdminData,
    loading: true,
    error: null,
    refreshing: false
  });

  const fetchAdminData = async (isRefresh = false) => {
    setState(prev => ({ 
      ...prev, 
      loading: !isRefresh, 
      refreshing: isRefresh,
      error: null 
    }));

    try {
      // Simulate fetching admin overview data
      const data = await simulateAPICall(mockAdminData, isRefresh ? 500 : 1000, 0.05);
      
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

  const refreshData = () => {
    fetchAdminData(true);
  };

  const exportOverviewReport = async (format: 'pdf' | 'csv' = 'pdf'): Promise<void> => {
    try {
      await simulateAPICall({ success: true }, 2000, 0.08);
      
      console.log(`Exporting ${format.toUpperCase()} overview report`);
      
      // In real app, this would trigger file download
      if (format === 'csv') {
        const csvContent = [
          'Month,Businesses,Messages,Campaigns',
          ...state.data.growthData.map(item => 
            `${item.name},${item.businesses},${item.messages},${item.campaigns}`
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `platform-overview-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      throw new Error(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    ...state,
    refreshData,
    exportOverviewReport,
    refetchData: () => fetchAdminData()
  };
};
