import React from "react";
import { TrendingUp, Users } from "lucide-react";
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
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor platform performance and business growth.
        </p>
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
