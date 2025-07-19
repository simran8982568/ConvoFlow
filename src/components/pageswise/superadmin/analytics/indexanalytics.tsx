import React, { useState } from "react";
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import components
import HeaderCard from "./headercard";
import MessageVolumeChart from "./messagevolumechart";
import TopTemplatesChart from "./toptemplateschart";
import BusinessGrowthChart from "./businessgrowthchart";
import IndustryDistributionChart from "./industrydistributionchart";
import ErrorBoundary from "./errorboundary";

// Import data hook
import { useAnalyticsData, exportAnalyticsReport } from "./analyticsdata";

const SuperAdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Use the analytics data hook
  const {
    kpiData,
    messageVolumeData,
    topTemplatesData,
    businessGrowthData,
    industryData,
    loading,
    error,
    refetchData,
  } = useAnalyticsData(timeRange);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const result = await exportAnalyticsReport(timeRange, "pdf");
      toast({
        title: "Export Successful",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description:
          error instanceof Error ? error.message : "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    refetchData();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been refreshed successfully.",
    });
  };

  // Show global error state
  if (error && !loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load Analytics
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700"
          >
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
            <h1 className="text-3xl font-bold text-gray-900">
              Platform Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into platform usage and growth
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={loading}
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleExportReport}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isExporting || loading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <HeaderCard data={kpiData} loading={loading} error={error} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessageVolumeChart
            data={messageVolumeData}
            loading={loading}
            error={error}
          />
          <TopTemplatesChart
            data={topTemplatesData}
            loading={loading}
            error={error}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BusinessGrowthChart
            data={businessGrowthData}
            loading={loading}
            error={error}
          />
          <IndustryDistributionChart
            data={industryData}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SuperAdminAnalytics;
