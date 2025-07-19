import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  totalRevenue: number;
  monthlyGrowth: number;
  messageGrowth: number;
  revenueGrowth: number;
  userGrowth: number;
}

export interface PlatformGrowthData {
  month: string;
  users: number;
  messages: number;
  revenue: number;
}

export interface PlanDistributionData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface ActivityItem {
  id: number;
  type: 'user_signup' | 'plan_upgrade' | 'message_sent' | 'campaign_created';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

export const useDashboardAPI = () => {
  const { toast } = useToast();

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/dashboard/stats');
      // if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      return {
        totalUsers: 1247,
        activeUsers: 892,
        totalMessages: 156789,
        totalRevenue: 45670,
        monthlyGrowth: 12.5,
        messageGrowth: 18.3,
        revenueGrowth: 15.7,
        userGrowth: 8.9
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchPlatformGrowth = async (): Promise<PlatformGrowthData[]> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/dashboard/growth');
      // if (!response.ok) throw new Error('Failed to fetch platform growth');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for now
      return [
        { month: 'Jan', users: 850, messages: 45000, revenue: 28500 },
        { month: 'Feb', users: 920, messages: 52000, revenue: 31200 },
        { month: 'Mar', users: 1050, messages: 61000, revenue: 35800 },
        { month: 'Apr', users: 1180, messages: 68000, revenue: 39600 },
        { month: 'May', users: 1290, messages: 75000, revenue: 42300 },
        { month: 'Jun', users: 1420, messages: 82000, revenue: 45670 }
      ];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch platform growth data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchPlanDistribution = async (): Promise<PlanDistributionData[]> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/dashboard/plans');
      // if (!response.ok) throw new Error('Failed to fetch plan distribution');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data for now
      const data = [
        { name: 'Free', value: 450, color: '#6B7280', percentage: 36.1 },
        { name: 'Starter', value: 320, color: '#3B82F6', percentage: 25.7 },
        { name: 'Pro', value: 280, color: '#10B981', percentage: 22.5 },
        { name: 'Enterprise', value: 197, color: '#8B5CF6', percentage: 15.8 }
      ];
      
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch plan distribution data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/dashboard/activity');
      // if (!response.ok) throw new Error('Failed to fetch recent activity');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Mock data for now
      return [
        {
          id: 1,
          type: 'user_signup',
          title: 'New User Registration',
          description: 'TechCorp Solutions signed up for Enterprise plan',
          timestamp: '2024-07-18T10:30:00Z',
          user: 'admin@techcorp.com',
          metadata: { plan: 'Enterprise', revenue: 299 }
        },
        {
          id: 2,
          type: 'plan_upgrade',
          title: 'Plan Upgrade',
          description: 'Digital Marketing Pro upgraded from Starter to Pro',
          timestamp: '2024-07-18T09:15:00Z',
          user: 'contact@digitalmarketing.com',
          metadata: { from: 'Starter', to: 'Pro', revenue: 150 }
        },
        {
          id: 3,
          type: 'campaign_created',
          title: 'Campaign Created',
          description: 'Global Retail Co created a new marketing campaign',
          timestamp: '2024-07-18T08:45:00Z',
          user: 'support@globalretail.com',
          metadata: { campaignName: 'Summer Sale 2024', templates: 5 }
        },
        {
          id: 4,
          type: 'message_sent',
          title: 'High Message Volume',
          description: 'HealthTech Innovations sent 1,000+ messages today',
          timestamp: '2024-07-18T07:20:00Z',
          user: 'info@healthtech.com',
          metadata: { messageCount: 1247, campaignId: 'HTI-2024-07' }
        },
        {
          id: 5,
          type: 'user_signup',
          title: 'New User Registration',
          description: 'EcoFriendly Store signed up for Starter plan',
          timestamp: '2024-07-17T16:30:00Z',
          user: 'hello@ecofriendly.com',
          metadata: { plan: 'Starter', revenue: 29 }
        }
      ];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recent activity. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshDashboard = async () => {
    try {
      // Refresh all dashboard data
      const [stats, growth, plans, activity] = await Promise.all([
        fetchDashboardStats(),
        fetchPlatformGrowth(),
        fetchPlanDistribution(),
        fetchRecentActivity()
      ]);
      
      toast({
        title: "Dashboard Refreshed",
        description: "All dashboard data has been updated successfully.",
      });
      
      return { stats, growth, plans, activity };
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    fetchDashboardStats,
    fetchPlatformGrowth,
    fetchPlanDistribution,
    fetchRecentActivity,
    refreshDashboard,
  };
};
