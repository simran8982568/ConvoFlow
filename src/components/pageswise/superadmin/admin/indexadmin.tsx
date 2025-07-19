import React, { useState } from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import components
import HeaderCard from '../dashboard/headercard';
import PlatformGrowthChart from './platformgrowthchart';
import PlanDistributionChart from './plandistributionchart';
import RecentActivityCard from './recentactivitycard';
import ErrorBoundary from './errorboundary';

// Import data hook
import { useAdminData } from './admindata';

const IndexAdmin: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Use the admin data hook
  const {
    data,
    loading,
    error,
    refreshing,
    refreshData,
    exportOverviewReport,
    refetchData
  } = useAdminData();

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Data Refreshed",
      description: "Platform overview data has been refreshed successfully.",
    });
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await exportOverviewReport('csv');
      toast({
        title: "Export Successful",
        description: "Platform overview report has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRetry = () => {
    refetchData();
    toast({
      title: "Retrying",
      description: "Attempting to reload platform data...",
    });
  };

  // Show global error state
  if (error && !loading && !refreshing) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load Platform Overview
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-gray-600 mt-1">
              Monitor platform performance and business growth.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={loading || refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              onClick={handleExportReport}
              disabled={loading || isExporting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <HeaderCard loading={loading} error={error} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlatformGrowthChart 
            data={data.growthData} 
            loading={loading} 
            error={error} 
          />
          <PlanDistributionChart 
            data={data.planData} 
            loading={loading} 
            error={error} 
          />
        </div>

        {/* Recent Activity */}
        <RecentActivityCard 
          activities={data.recentActivities} 
          loading={loading} 
          error={error} 
        />
      </div>
    </ErrorBoundary>
  );
};

export default IndexAdmin;
