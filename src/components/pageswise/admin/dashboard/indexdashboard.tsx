import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import components
import StatsCards from './statscards';
import EngagementChart from './engagementchart';
import RecentActivityCard from './recentactivitycard';
import ErrorBoundary from './errorboundary';

// Import data hook
import { useDashboardData } from './dashboarddata';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  // Use the dashboard data hook
  const {
    data,
    loading,
    error,
    refreshing,
    refreshData,
    refetchData
  } = useDashboardData();

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Dashboard Refreshed",
      description: "Dashboard data has been refreshed successfully.",
    });
  };

  const handleRetry = () => {
    refetchData();
    toast({
      title: "Retrying",
      description: "Attempting to reload dashboard data...",
    });
  };

  // Show global error state
  if (error && !loading && !refreshing) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4 md:p-6 space-y-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Welcome back! Here's what's happening with your campaigns.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              size="sm"
              className="md:size-default"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              <span className="sm:hidden">
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsCards
          stats={data.stats}
          loading={loading}
          error={error}
        />

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EngagementChart
            data={data.engagementData}
            loading={loading}
            error={error}
          />
          <RecentActivityCard
            activities={data.recentActivities}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
