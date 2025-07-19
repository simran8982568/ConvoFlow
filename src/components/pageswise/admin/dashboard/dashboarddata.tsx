import { useState, useEffect } from 'react';

// Data interfaces
export interface DashboardStats {
  totalMessages: string;
  activeContacts: string;
  campaignsSent: string;
  activeAutomations: string;
  messagesTrend: { value: string; isPositive: boolean };
  contactsTrend: { value: string; isPositive: boolean };
  campaignsTrend: { value: string; isPositive: boolean };
  automationsTrend: { value: string; isPositive: boolean };
}

export interface EngagementData {
  name: string;
  messages: number;
  delivered: number;
  replies: number;
}

export interface ActivityItem {
  id: number;
  campaign: string;
  status: 'Active' | 'Completed' | 'Scheduled';
  sent: number;
  delivered: number;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  engagementData: EngagementData[];
  recentActivities: ActivityItem[];
}

export interface DashboardDataState {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

// Mock data
const mockStats: DashboardStats = {
  totalMessages: "12,584",
  activeContacts: "3,247",
  campaignsSent: "156",
  activeAutomations: "23",
  messagesTrend: { value: "12% from last month", isPositive: true },
  contactsTrend: { value: "8% from last month", isPositive: true },
  campaignsTrend: { value: "24% from last month", isPositive: true },
  automationsTrend: { value: "3 new this week", isPositive: true }
};

const mockEngagementData: EngagementData[] = [
  { name: 'Jan', messages: 4000, delivered: 3800, replies: 1200 },
  { name: 'Feb', messages: 3000, delivered: 2900, replies: 980 },
  { name: 'Mar', messages: 2000, delivered: 1950, replies: 850 },
  { name: 'Apr', messages: 2780, delivered: 2700, replies: 920 },
  { name: 'May', messages: 1890, delivered: 1820, replies: 740 },
  { name: 'Jun', messages: 2390, delivered: 2300, replies: 890 },
];

const mockRecentActivities: ActivityItem[] = [
  { id: 1, campaign: 'Welcome Series', status: 'Active', sent: 1250, delivered: 1180, time: '2 hours ago' },
  { id: 2, campaign: 'Product Launch', status: 'Completed', sent: 890, delivered: 856, time: '1 day ago' },
  { id: 3, campaign: 'Holiday Sale', status: 'Scheduled', sent: 0, delivered: 0, time: 'Tomorrow 9:00 AM' },
  { id: 4, campaign: 'Cart Abandonment', status: 'Active', sent: 156, delivered: 149, time: '3 hours ago' },
];

const mockDashboardData: DashboardData = {
  stats: mockStats,
  engagementData: mockEngagementData,
  recentActivities: mockRecentActivities
};

// Simulate API calls with delays and potential errors
const simulateAPICall = <T,>(data: T, delay: number = 800, errorRate: number = 0.05): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to fetch dashboard data'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for dashboard data management
export const useDashboardData = () => {
  const [state, setState] = useState<DashboardDataState>({
    data: mockDashboardData,
    loading: true,
    error: null,
    refreshing: false
  });

  const fetchDashboardData = async (isRefresh = false) => {
    setState(prev => ({ 
      ...prev, 
      loading: !isRefresh, 
      refreshing: isRefresh,
      error: null 
    }));

    try {
      // Simulate fetching dashboard data
      const data = await simulateAPICall(mockDashboardData, isRefresh ? 500 : 1000, 0.05);
      
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
    fetchDashboardData(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...state,
    refreshData,
    refetchData: () => fetchDashboardData()
  };
};
