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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {mockBusinesses.length}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {activeBusinesses} active
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Active Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {activeBusinesses}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {((activeBusinesses / mockBusinesses.length) * 100).toFixed(1)}%
            active rate
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Total Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Total Automations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
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
