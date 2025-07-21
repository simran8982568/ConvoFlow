// Stats cards component for campaign metrics

import React from "react";
import { Send, Play, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "./mockdata";
import {
  getTotalMessagesSent,
  getActiveCampaignsCount,
  calculateAverageOpenRate,
} from "./actions";

interface CampaignStatsCardsProps {
  campaigns: Campaign[];
}

const CampaignStatsCards: React.FC<CampaignStatsCardsProps> = ({
  campaigns,
}) => {
  const totalCampaigns = campaigns.length;
  const activeCampaigns = getActiveCampaignsCount(campaigns);
  const totalMessagesSent = getTotalMessagesSent(campaigns);
  const averageOpenRate = calculateAverageOpenRate(campaigns);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {/* Total Campaigns Card */}
      <Card>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Campaigns
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {totalCampaigns}
              </p>
            </div>
            <Send className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-teal-600 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns Card */}
      <Card>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Active Campaigns
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {activeCampaigns}
              </p>
            </div>
            <Play className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      {/* Messages Sent Card */}
      <Card>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Messages Sent</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {totalMessagesSent.toLocaleString()}
              </p>
            </div>
            <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      {/* Average Open Rate Card */}
      <Card>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Avg. Open Rate
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {averageOpenRate}%
              </p>
            </div>
            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignStatsCards;
