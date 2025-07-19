// Campaigns grid component to display campaign cards

import React from "react";
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-4 h-4 text-teal-600" />
                  {campaign.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  Template: {campaign.template} • Audience: {campaign.audience}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                {getStatusBadge(campaign.status)}
                {getTypeBadge(campaign.type)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Campaign Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.sent.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Sent</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.delivered.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {calculateOpenRate(campaign.opened, campaign.delivered)}%
                  </p>
                  <p className="text-sm text-gray-600">Open Rate</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {calculateClickRate(campaign.clicked, campaign.opened)}%
                  </p>
                  <p className="text-sm text-gray-600">Click Rate</p>
                </div>
              </div>

              {/* Schedule Info */}
              <ScheduleInfo campaign={campaign} />

              {/* Action Buttons */}
              <CampaignActionButtons campaign={campaign} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CampaignsGrid;
