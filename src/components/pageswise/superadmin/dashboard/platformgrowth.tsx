import React from "react";
import { TrendingUp } from "lucide-react";
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
} from "recharts";

interface PlatformGrowthProps {
  mockGrowthData: Array<{
    name: string;
    businesses: number;
    messages: number;
    campaigns: number;
  }>;
}

const PlatformGrowth: React.FC<PlatformGrowthProps> = ({ mockGrowthData }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Platform Growth
      </CardTitle>
      <CardDescription>
        Monthly growth in businesses and messages
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="businesses" fill="#0d9488" name="New Businesses" />
          <Bar dataKey="messages" fill="#3b82f6" name="Messages (000s)" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default PlatformGrowth;
