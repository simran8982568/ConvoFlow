import { useState, useEffect } from 'react';
import { 
  useDashboardAPI, 
  DashboardStats, 
  PlatformGrowthData, 
  PlanDistributionData, 
  ActivityItem 
} from '../dashboardapi';

export interface DashboardData {
  stats: DashboardStats | null;
  growth: PlatformGrowthData[];
  plans: PlanDistributionData[];
  activity: ActivityItem[];
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    growth: [],
    plans: [],
    activity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const dashboardAPI = useDashboardAPI();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stats, growth, plans, activity] = await Promise.all([
        dashboardAPI.fetchDashboardStats(),
        dashboardAPI.fetchPlatformGrowth(),
        dashboardAPI.fetchPlanDistribution(),
        dashboardAPI.fetchRecentActivity()
      ]);

      setData({
        stats,
        growth,
        plans,
        activity
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    try {
      const refreshedData = await dashboardAPI.refreshDashboard();
      setData({
        stats: refreshedData.stats,
        growth: refreshedData.growth,
        plans: refreshedData.plans,
        activity: refreshedData.activity
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to refresh dashboard');
      console.error('Dashboard refresh error:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Computed values
  const getGrowthTrend = (metric: 'users' | 'messages' | 'revenue') => {
    if (data.growth.length < 2) return 0;
    
    const latest = data.growth[data.growth.length - 1][metric];
    const previous = data.growth[data.growth.length - 2][metric];
    
    return ((latest - previous) / previous) * 100;
  };

  const getTotalPlanUsers = () => {
    return data.plans.reduce((sum, plan) => sum + plan.value, 0);
  };

  const getTopPlan = () => {
    return data.plans.reduce((top, plan) => 
      plan.value > top.value ? plan : top, 
      data.plans[0] || { name: 'None', value: 0, color: '#000', percentage: 0 }
    );
  };

  const getRecentActivityByType = (type: ActivityItem['type']) => {
    return data.activity.filter(item => item.type === type);
  };

  const getActivityStats = () => {
    const stats = {
      signups: 0,
      upgrades: 0,
      campaigns: 0,
      messages: 0
    };

    data.activity.forEach(item => {
      switch (item.type) {
        case 'user_signup':
          stats.signups++;
          break;
        case 'plan_upgrade':
          stats.upgrades++;
          break;
        case 'campaign_created':
          stats.campaigns++;
          break;
        case 'message_sent':
          stats.messages++;
          break;
      }
    });

    return stats;
  };

  const getRevenueFromActivity = () => {
    return data.activity.reduce((total, item) => {
      return total + (item.metadata?.revenue || 0);
    }, 0);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return lastUpdated.toLocaleDateString();
  };

  const getHealthScore = () => {
    if (!data.stats) return 0;
    
    // Calculate health score based on various metrics
    const activeUserRatio = data.stats.activeUsers / data.stats.totalUsers;
    const growthScore = Math.min(data.stats.monthlyGrowth / 20, 1); // Cap at 20% growth
    const revenueScore = Math.min(data.stats.revenueGrowth / 25, 1); // Cap at 25% growth
    
    return Math.round((activeUserRatio * 40 + growthScore * 30 + revenueScore * 30) * 100);
  };

  const getPlatformInsights = () => {
    const insights = [];
    
    if (data.stats) {
      const activeRatio = (data.stats.activeUsers / data.stats.totalUsers) * 100;
      
      if (activeRatio > 80) {
        insights.push({
          type: 'positive',
          message: `High user engagement: ${activeRatio.toFixed(1)}% of users are active`
        });
      } else if (activeRatio < 60) {
        insights.push({
          type: 'warning',
          message: `Low user engagement: Only ${activeRatio.toFixed(1)}% of users are active`
        });
      }
      
      if (data.stats.monthlyGrowth > 15) {
        insights.push({
          type: 'positive',
          message: `Strong growth: ${data.stats.monthlyGrowth}% monthly increase`
        });
      } else if (data.stats.monthlyGrowth < 5) {
        insights.push({
          type: 'warning',
          message: `Slow growth: Only ${data.stats.monthlyGrowth}% monthly increase`
        });
      }
    }
    
    const topPlan = getTopPlan();
    if (topPlan.name === 'Free') {
      insights.push({
        type: 'info',
        message: 'Most users are on the Free plan - consider conversion strategies'
      });
    }
    
    return insights;
  };

  return {
    // Data
    data,
    loading,
    error,
    lastUpdated,
    
    // Actions
    loadDashboardData,
    refreshDashboard,
    
    // Computed values
    getGrowthTrend,
    getTotalPlanUsers,
    getTopPlan,
    getRecentActivityByType,
    getActivityStats,
    getRevenueFromActivity,
    formatLastUpdated,
    getHealthScore,
    getPlatformInsights,
    
    // Quick access to data
    stats: data.stats,
    growth: data.growth,
    plans: data.plans,
    activity: data.activity
  };
};
