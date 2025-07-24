import React, { useState } from "react";
import { Download, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [timeRange, setTimeRange] = useState("1month");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Month options for the filter
  const monthOptions = [
    { value: "all", label: "All Months" },
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

    return data.filter(item => {
      if (item.month) {
        return item.month.toLowerCase().includes(selectedMonth);
      }
      return true;
    });
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Dynamic import for better code splitting
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      // Create a temporary container for PDF export
      const tempContainer = document.createElement('div');
      tempContainer.id = 'analytics-export-container';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';

      // Clone the analytics content
      const analyticsContent = document.querySelector('.p-6.space-y-6');
      if (analyticsContent) {
        tempContainer.innerHTML = analyticsContent.innerHTML;

        // Remove buttons and interactive elements from the clone
        const buttons = tempContainer.querySelectorAll('button, select');
        buttons.forEach(button => button.remove());
      }

      document.body.appendChild(tempContainer);

      // Generate PDF
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');

      // Add title and metadata
      pdf.setFontSize(20);
      pdf.text('Platform Analytics Report', 20, 20);

      pdf.setFontSize(12);
      const monthLabel = selectedMonth === "all" ? "All Months" : monthOptions.find(m => m.value === selectedMonth)?.label;
      pdf.text(`Period: ${monthLabel}`, 20, 30);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);

      // Add the chart image
      const imgWidth = 260;
      const pageHeight = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 50;

      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 50;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `analytics-report-${selectedMonth}-${timestamp}.pdf`;
      pdf.save(filename);

      // Clean up
      document.body.removeChild(tempContainer);

      toast({
        title: "Export Successful",
        description: `Analytics report for ${selectedMonth === "all" ? "all months" : monthOptions.find(m => m.value === selectedMonth)?.label} has been downloaded.`,
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
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={loading}
            >
              <option value="1month">Last Month</option>
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
              className="bg-purple-600 hover:bg-purple-700"
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
