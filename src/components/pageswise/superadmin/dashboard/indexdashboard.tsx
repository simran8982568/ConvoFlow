import React, { useState } from "react";
import { TrendingUp, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

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
        const imgWidth = 280;
        const pageHeight = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('superadmin-dashboard.pdf');

        toast({
          title: "Export Successful",
          description: "Dashboard has been exported to PDF successfully.",
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
        <PlatformGrowth mockGrowthData={mockGrowthData} />
        {/* Plan Distribution */}
        <PlanDistribution mockPlanData={mockPlanData} />
      </div>
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default IndexAdmin;
