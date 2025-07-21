import React, { useState } from 'react';
import { Activity, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import components
import LogsStatsCard from './logsstatscard';
import LogsFilterBar from './logsfilterbar';
import LogsTable from './logstable';
import ErrorBoundary from './errorboundary';


// Import data hook
import { useLogsData } from './logsdata';

const SuperAdminLogs: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Use the logs data hook
  const {
    logs,
    loading,
    error,
    refreshing,
    filters,
    filteredLogs,
    updateFilters,
    clearFilters,
    refreshLogs,
    downloadLogs,
    refetchLogs
  } = useLogsData();

  const handleRefresh = () => {
    refreshLogs();
    toast({
      title: "Logs Refreshed",
      description: "System logs have been refreshed successfully.",
    });
  };

  const handleDownloadLogs = async (format: 'csv' | 'json' = 'csv') => {
    setIsDownloading(true);
    try {
      await downloadLogs(format);
      toast({
        title: "Download Complete",
        description: `Logs have been downloaded as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download logs",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetry = () => {
    refetchLogs();
    toast({
      title: "Retrying",
      description: "Attempting to reload system logs...",
    });
  };

  // Show global error state
  if (error && !loading && !refreshing) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load System Logs
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
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600 mt-1">Monitor system activities and troubleshoot issues</p>
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
            <div className="flex items-center gap-1">
              <Button 
                onClick={() => handleDownloadLogs('csv')}
                disabled={loading || isDownloading || filteredLogs.length === 0}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download CSV'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDownloadLogs('json')}
                disabled={loading || isDownloading || filteredLogs.length === 0}
                className="px-3"
                title="Download as JSON"
              >
                JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <LogsStatsCard 
          logs={logs} 
          loading={loading} 
          error={error} 
        />

        {/* Activity Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Logs
              {!loading && (
                <span className="ml-auto text-sm font-normal text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Real-time system activity and error tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter Bar */}
            <LogsFilterBar
              searchTerm={filters.searchTerm}
              filterModule={filters.filterModule}
              filterStatus={filters.filterStatus}
              onSearchChange={(value) => updateFilters({ searchTerm: value })}
              onModuleChange={(value) => updateFilters({ filterModule: value })}
              onStatusChange={(value) => updateFilters({ filterStatus: value })}
              onClearFilters={clearFilters}
              loading={loading}
              filteredCount={filteredLogs.length}
              totalCount={logs.length}
            />

            {/* Logs Table */}
            <div className="mt-6">
              <LogsTable 
                logs={filteredLogs} 
                loading={loading} 
                error={error} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default SuperAdminLogs;
