import React, { useState } from "react";
import { Download, RefreshCw, AlertCircle, Calendar } from "lucide-react";
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
  const [timeRange, setTimeRange] = useState("3months");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Month options for the filter
  const monthOptions = [
    { value: "all", label: "All Month" },
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

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

  // Filter data based on selected month
  const getFilteredData = (data: any[]) => {
    if (selectedMonth === "all") return data;
    return data.filter((item) => {
      if (item.month) {
        return item.month.toLowerCase().includes(selectedMonth);
      }
      return true;
    });
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Create CSV content with filtered data
      const filteredMessageVolumeData = getFilteredData(messageVolumeData);
      const filteredBusinessGrowthData = getFilteredData(businessGrowthData);

      // Create comprehensive CSV export
      const csvData = [
        // KPI Data
        ["KPI Metrics"],
        ["Metric", "Value", "Trend"],
        [
          "Monthly Active Users",
          kpiData?.monthlyActiveUsers.value || 0,
          `${kpiData?.monthlyActiveUsers.trend || 0}%`,
        ],
        [
          "Messages Sent",
          kpiData?.messagesSent.value || 0,
          `${kpiData?.messagesSent.trend || 0}%`,
        ],
        [
          "Template Approvals",
          kpiData?.templateApprovals.value || 0,
          `${kpiData?.templateApprovals.trend || 0}%`,
        ],
        [
          "Automation Runs",
          kpiData?.automationRuns.value || 0,
          `${kpiData?.automationRuns.trend || 0}%`,
        ],
        [""],

        // Message Volume Data
        ["Message Volume Data"],
        ["Month", "Messages", "Businesses"],
        ...filteredMessageVolumeData.map((item) => [
          item.month,
          item.messages,
          item.businesses,
        ]),
        [""],

        // Business Growth Data
        ["Business Growth Data"],
        ["Month", "New Businesses", "Total Businesses"],
        ...filteredBusinessGrowthData.map((item) => [
          item.month,
          item.new,
          item.total,
        ]),
        [""],

        // Top Templates Data
        ["Top Templates"],
        ["Template Name", "Usage Count", "Category"],
        ...topTemplatesData.map((item) => [item.name, item.usage, "N/A"]),
      ];

      const csvContent = csvData.map((row) => row.join(",")).join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      const monthLabel = selectedMonth === "all" ? "all-months" : selectedMonth;
      link.setAttribute(
        "download",
        `analytics-report-${monthLabel}-${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Analytics report for ${
          selectedMonth === "all"
            ? "all months"
            : monthOptions.find((m) => m.value === selectedMonth)?.label
        } has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics report. Please try again.",
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
          <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:justify-end sm:gap-2">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                {/* Mobile: Only calendar icon, no dropdown */}
                <span className="flex items-center md:hidden h-8 w-8 justify-center">
                  <Calendar className="text-gray-400 h-5 w-5" />
                </span>
                {/* Desktop: Show full month dropdown */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="pl-9 h-10 w-48 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-purple-500 transition-all duration-150 shadow-sm text-center"
                      disabled={loading}
                    >
                      {monthOptions.map((month) => (
                        <option
                          key={month.value}
                          value={month.value}
                          className="text-center"
                        >
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="flex-1 px-2 py-1 h-8 border border-gray-300 rounded-md text-xs md:text-sm md:h-10 sm:flex-none"
                disabled={loading}
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={loading}
                className="flex-1 md:flex-none p-0 h-8 w-8 min-w-0 md:h-10 md:w-auto md:p-2 flex items-center justify-center"
                title={loading ? "Refreshing..." : "Refresh"}
              >
                <RefreshCw
                  className={`h-4 w-4 mx-auto md:mr-2 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden md:inline">Refresh</span>
              </Button>
              <Button
                onClick={handleExportReport}
                className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 p-0 h-8 w-8 min-w-0 md:h-10 md:w-auto md:p-2 flex items-center justify-center"
                disabled={isExporting || loading}
                title={isExporting ? "Exporting..." : "Export Report"}
              >
                <Download className="h-4 w-4 mx-auto md:mr-2" />
                <span className="hidden md:inline">
                  {isExporting ? "Exporting..." : "Export Report"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <HeaderCard data={kpiData} loading={loading} error={error} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessageVolumeChart
            data={getFilteredData(messageVolumeData)}
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
            data={getFilteredData(businessGrowthData)}
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
