import { useState, useEffect } from 'react';

// Data interfaces
export interface KPIData {
  monthlyActiveUsers: { value: number; trend: number };
  messagesSent: { value: number; trend: number };
  templateApprovals: { value: number; trend: number };
  automationRuns: { value: number; trend: number };
}

export interface MessageVolumeData {
  month: string;
  messages: number;
  businesses: number;
}

export interface TopTemplateData {
  name: string;
  usage: number;
}

export interface BusinessGrowthData {
  month: string;
  new: number;
  total: number;
}

export interface IndustryData {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsDataState {
  kpiData: KPIData | null;
  messageVolumeData: MessageVolumeData[];
  topTemplatesData: TopTemplateData[];
  businessGrowthData: BusinessGrowthData[];
  industryData: IndustryData[];
  loading: boolean;
  error: string | null;
}

// Mock data - In real app, this would come from API
const mockKPIData: KPIData = {
  monthlyActiveUsers: { value: 2847, trend: 12 },
  messagesSent: { value: 67000, trend: 18 },
  templateApprovals: { value: 156, trend: 8 },
  automationRuns: { value: 3429, trend: 25 }
};

const mockMessageVolumeData: MessageVolumeData[] = [
  { month: 'Jan', messages: 45000, businesses: 12 },
  { month: 'Feb', messages: 52000, businesses: 15 },
  { month: 'Mar', messages: 48000, businesses: 18 },
  { month: 'Apr', messages: 61000, businesses: 22 },
  { month: 'May', messages: 55000, businesses: 25 },
  { month: 'Jun', messages: 67000, businesses: 28 },
];

const mockTopTemplatesData: TopTemplateData[] = [
  { name: 'Welcome Message', usage: 1250 },
  { name: 'Order Confirmation', usage: 980 },
  { name: 'Payment Reminder', usage: 750 },
  { name: 'Appointment Booking', usage: 680 },
  { name: 'Support Response', usage: 520 },
];

const mockBusinessGrowthData: BusinessGrowthData[] = [
  { month: 'Jan', new: 12, total: 45 },
  { month: 'Feb', new: 15, total: 60 },
  { month: 'Mar', new: 18, total: 78 },
  { month: 'Apr', new: 22, total: 100 },
  { month: 'May', new: 25, total: 125 },
  { month: 'Jun', new: 28, total: 153 },
];

const mockIndustryData: IndustryData[] = [
  { name: 'E-commerce', value: 35, color: '#0D9488' },
  { name: 'Healthcare', value: 20, color: '#3B82F6' },
  { name: 'Education', value: 15, color: '#8B5CF6' },
  { name: 'Finance', value: 12, color: '#F59E0B' },
  { name: 'Real Estate', value: 10, color: '#EF4444' },
  { name: 'Others', value: 8, color: '#6B7280' },
];

// Simulate API calls with delays and potential errors
const simulateAPICall = <T,>(data: T, delay: number = 1000, errorRate: number = 0.1): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Failed to fetch data from server'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Custom hook for analytics data management
export const useAnalyticsData = (timeRange: string = '6months') => {
  const [state, setState] = useState<AnalyticsDataState>({
    kpiData: null,
    messageVolumeData: [],
    topTemplatesData: [],
    businessGrowthData: [],
    industryData: [],
    loading: true,
    error: null
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate parallel API calls
      const [kpi, messageVolume, topTemplates, businessGrowth, industry] = await Promise.all([
        simulateAPICall(mockKPIData, 800, 0.05),
        simulateAPICall(mockMessageVolumeData, 1000, 0.05),
        simulateAPICall(mockTopTemplatesData, 600, 0.05),
        simulateAPICall(mockBusinessGrowthData, 900, 0.05),
        simulateAPICall(mockIndustryData, 700, 0.05)
      ]);

      setState({
        kpiData: kpi,
        messageVolumeData: messageVolume,
        topTemplatesData: topTemplates,
        businessGrowthData: businessGrowth,
        industryData: industry,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const refetchData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  return {
    ...state,
    refetchData
  };
};

// Export report functionality
export const exportAnalyticsReport = async (timeRange: string, format: 'pdf' | 'csv' = 'pdf') => {
  try {
    // Simulate export API call
    await simulateAPICall({ success: true }, 2000, 0.1);
    
    // In real app, this would trigger file download
    console.log(`Exporting ${format.toUpperCase()} report for ${timeRange}`);
    
    return { success: true, message: `${format.toUpperCase()} report exported successfully` };
  } catch (error) {
    throw new Error(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
