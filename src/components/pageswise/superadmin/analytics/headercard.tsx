import React from "react";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIData {
  monthlyActiveUsers: {
    value: number;
    trend: number;
  };
  messagesSent: {
    value: number;
    trend: number;
  };
  templateApprovals: {
    value: number;
    trend: number;
  };
  automationRuns: {
    value: number;
    trend: number;
  };
}

interface HeaderCardProps {
  data: KPIData;
  loading?: boolean;
  error?: string | null;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  data,
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-4">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading KPI data</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0;
    return (
      <div
        className={`text-xs flex items-center gap-1 mt-1 ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        <TrendingUp className={`h-3 w-3 ${!isPositive ? "rotate-180" : ""}`} />
        {isPositive ? "+" : ""}
        {trend}% from last month
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Monthly Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {data.monthlyActiveUsers.value.toLocaleString()}
          </div>
          {formatTrend(data.monthlyActiveUsers.trend)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages Sent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-600">
            {data.messagesSent.value.toLocaleString()}
          </div>
          {formatTrend(data.messagesSent.trend)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Template Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {data.templateApprovals.value.toLocaleString()}
          </div>
          {formatTrend(data.templateApprovals.trend)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Automation Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {data.automationRuns.value.toLocaleString()}
          </div>
          {formatTrend(data.automationRuns.trend)}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderCard;
