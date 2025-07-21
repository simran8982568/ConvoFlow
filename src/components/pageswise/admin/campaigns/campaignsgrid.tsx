// Campaigns grid component to display campaign cards

import React, { useState } from "react";
import { Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Campaign } from "./mockdata";
import {
  getStatusBadge,
  getTypeBadge,
  calculateOpenRate,
  calculateClickRate,
} from "./actions";
import CampaignActionButtons from "./actionbuttons";
import ScheduleInfo from "./scheduleinfo";

interface CampaignsGridProps {
  campaigns: Campaign[];
}

const CampaignsGrid: React.FC<CampaignsGridProps> = ({ campaigns }) => {
  const [pausedCampaigns, setPausedCampaigns] = useState<Set<number>>(new Set());

  const handlePauseToggle = (campaignId: number, isPaused: boolean) => {
    setPausedCampaigns(prev => {
      const newSet = new Set(prev);
      if (isPaused) {
        newSet.add(campaignId);
      } else {
        newSet.delete(campaignId);
      }
      return newSet;
    });
  };
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <Send className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No campaigns found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {campaigns.map((campaign) => {
        const isPaused = pausedCampaigns.has(campaign.id);
        return (
          <Card
            key={campaign.id}
            className={`hover:shadow-lg transition-all duration-300 ${
              isPaused ? 'bg-red-50 border-red-200' : ''
            }`}
          >
            <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-sm sm:text-base md:text-lg flex items-center gap-1 sm:gap-2 ${
                    isPaused ? 'text-red-700' : ''
                  }`}>
                    <Send className={`w-3 h-3 sm:w-4 sm:h-4 ${isPaused ? 'text-red-600' : 'text-teal-600'}`} />
                    <span className="truncate">{campaign.name}</span>
                    {isPaused && <span className="text-xs sm:text-sm font-normal text-red-600 flex-shrink-0">(Paused)</span>}
                  </CardTitle>
                  <CardDescription className={`mt-1 text-xs sm:text-sm truncate ${isPaused ? 'text-red-600' : ''}`}>
                    Template: {campaign.template} • Audience: {campaign.audience}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0 ml-2">
                  {getStatusBadge(campaign.status)}
                  {getTypeBadge(campaign.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {/* Campaign Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {campaign.sent.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Sent</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">
                    {campaign.delivered.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Delivered</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                    {calculateOpenRate(campaign.opened, campaign.delivered)}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Open Rate</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                    {calculateClickRate(campaign.clicked, campaign.opened)}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Click Rate</p>
                </div>
              </div>

              {/* Schedule Info */}
              <ScheduleInfo campaign={campaign} />

                {/* Action Buttons */}
                <CampaignActionButtons
                  campaign={campaign}
                  isPaused={isPaused}
                  onPauseToggle={handlePauseToggle}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CampaignsGrid;
