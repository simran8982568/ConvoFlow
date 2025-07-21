import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, MessageSquare, Zap } from "lucide-react";
import type { Business } from "../../../../api/apicall/superadmin/businesses/businessapi";

interface BusinessDirectoryProps {
  mockBusinesses: Business[];
}

const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({
  mockBusinesses,
}) => {
  const totalMessages = mockBusinesses.reduce((sum, b) => sum + b.messages, 0);
  const totalCampaigns = mockBusinesses.reduce(
    (sum, b) => sum + b.campaigns,
    0
  );
  const activeBusinesses = mockBusinesses.filter(
    (b) => b.status === "Active"
  ).length;
  const totalAutomations = mockBusinesses.reduce(
    (sum, b) => sum + b.automations,
    0
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Total Businesses</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            {mockBusinesses.length}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {activeBusinesses} active
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Active Businesses</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
            {activeBusinesses}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {((activeBusinesses / mockBusinesses.length) * 100).toFixed(1)}%
            active rate
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Total Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
            {totalMessages.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Avg:{" "}
            {Math.round(totalMessages / mockBusinesses.length).toLocaleString()}{" "}
            per business
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Total Automations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
            {totalAutomations}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {totalCampaigns} campaigns total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDirectory;
