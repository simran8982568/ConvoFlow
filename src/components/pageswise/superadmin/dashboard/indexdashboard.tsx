import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HeaderCard from "./headercard";
import PlatformGrowth from "./platformgrowth";
import PlanDistribution from "./plandistribution";
import RecentActivity from "./recentactivity";
// ...existing code...
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data - TODO: Replace with real API calls
const mockGrowthData = [
  { name: "Jan", businesses: 45, messages: 125000, campaigns: 890 },
  { name: "Feb", businesses: 52, messages: 143000, campaigns: 1020 },
  { name: "Mar", businesses: 67, messages: 156000, campaigns: 1150 },
  { name: "Apr", businesses: 78, messages: 187000, campaigns: 1340 },
  { name: "May", businesses: 89, messages: 234000, campaigns: 1580 },
  { name: "Jun", businesses: 103, messages: 267000, campaigns: 1720 },
];

const mockPlanData = [
  { name: "Free", value: 45, color: "#9ca3af" },
  { name: "Starter", value: 32, color: "#3b82f6" },
  { name: "Pro", value: 18, color: "#0d9488" },
  { name: "Enterprise", value: 8, color: "#7c3aed" },
];

const IndexAdmin: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(mockGrowthData);
  const { toast } = useToast();

  // Filter data based on date range
  useEffect(() => {
    if (!dateRange.from && !dateRange.to) {
      setFilteredData(mockGrowthData);
      return;
    }

    const filtered = mockGrowthData.filter(item => {
      // For demo purposes, we'll use month names to simulate date filtering
      // In a real app, you'd have actual dates to compare
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(item.name);
      const itemDate = new Date(2024, monthIndex, 1);

      let isInRange = true;

      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        isInRange = isInRange && itemDate >= fromDate;
      }

      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        isInRange = isInRange && itemDate <= toDate;
      }

      return isInRange;
    });

    setFilteredData(filtered);
  }, [dateRange]);

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ from: '', to: '' });
    setIsDatePickerOpen(false);
  };

  const applyDateRange = () => {
    setIsDatePickerOpen(false);
    toast({
      title: "Date Range Applied",
      description: `Dashboard filtered from ${dateRange.from || 'start'} to ${dateRange.to || 'end'}`,
    });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const dashboardElement = document.getElementById('superadmin-dashboard');
      if (dashboardElement) {
        const canvas = await html2canvas(dashboardElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#f9fafb',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');

        // Add title and metadata
        pdf.setFontSize(20);
        pdf.text('SuperAdmin Dashboard Report', 20, 20);

        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

        // Add date range info if applied
        if (dateRange.from || dateRange.to) {
          pdf.text(`Date Range: ${dateRange.from || 'Start'} to ${dateRange.to || 'End'}`, 20, 40);
        }

        const imgWidth = 260;
        const pageHeight = 170;
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

        // Generate filename with date range
        const timestamp = new Date().toISOString().split('T')[0];
        const dateRangeStr = (dateRange.from || dateRange.to)
          ? `-${dateRange.from || 'start'}-to-${dateRange.to || 'end'}`
          : '';
        const filename = `superadmin-dashboard${dateRangeStr}-${timestamp}.pdf`;

        pdf.save(filename);

        const dateRangeText = (dateRange.from || dateRange.to)
          ? ` (filtered: ${dateRange.from || 'start'} to ${dateRange.to || 'end'})`
          : '';

        toast({
          title: "Export Successful",
          description: `Dashboard has been exported to PDF successfully${dateRangeText}.`,
        });
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export dashboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="superadmin-dashboard" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600 mt-1">
            Monitor platform performance and business growth.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {dateRange.from || dateRange.to ? 'Date Range Set' : 'Select Date Range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Select Date Range</h4>
                  <p className="text-xs text-gray-500">
                    Filter dashboard data by date range
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">From</label>
                    <Input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => handleDateRangeChange('from', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">To</label>
                    <Input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => handleDateRangeChange('to', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {(dateRange.from || dateRange.to) && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Current filter:</strong> {dateRange.from || 'Start'} to {dateRange.to || 'End'}
                  </div>
                )}

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearDateRange}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={applyDateRange}
                    className="text-xs"
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>
      {/* Stats Grid */}
      <HeaderCard />
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <PlatformGrowth mockGrowthData={filteredData} />
        {/* Plan Distribution */}
        <PlanDistribution mockPlanData={mockPlanData} />
      </div>

      {/* Date Range Indicator */}
      {(dateRange.from || dateRange.to) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Filtered Data: {dateRange.from || 'Start'} to {dateRange.to || 'End'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearDateRange}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              Clear Filter
            </Button>
          </div>
        </div>
      )}
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default IndexAdmin;
