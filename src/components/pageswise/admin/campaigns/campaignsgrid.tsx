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

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const campaignsToShow = showAll ? campaigns : campaigns.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {campaignsToShow.map((campaign) => {
          // Mobile: compact card, expand on click
          return (
            <div key={campaign.id} className="md:block">
              <div className="block md:hidden">
                {expandedId === campaign.id ? (
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Send className="w-4 h-4 text-teal-600" />
                            <span className="truncate">{campaign.name}</span>
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs truncate">
                            Template: {campaign.template} • Audience:{" "}
                            {campaign.audience}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0 ml-2">
                          {getStatusBadge(campaign.status)}
                          {getTypeBadge(campaign.type)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-gray-900">
                              {campaign.sent.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">Sent</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-teal-600">
                              {campaign.delivered.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">Delivered</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-green-600">
                              {calculateOpenRate(
                                campaign.opened,
                                campaign.delivered
                              )}
                              %
                            </p>
                            <p className="text-xs text-gray-600">Open Rate</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-blue-600">
                              {calculateClickRate(
                                campaign.clicked,
                                campaign.opened
                              )}
                              %
                            </p>
                            <p className="text-xs text-gray-600">Click Rate</p>
                          </div>
                        </div>
                        <ScheduleInfo campaign={campaign} />
                        <CampaignActionButtons campaign={campaign} />
                        <button
                          className="mt-2 text-xs text-teal-600 underline"
                          onClick={() => setExpandedId(null)}
                        >
                          Hide Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    className="cursor-pointer hover:bg-gray-50 transition-all duration-200 p-3 flex items-center"
                    onClick={() => setExpandedId(campaign.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Send className="w-4 h-4 text-teal-600" />
                      <span className="font-medium text-sm truncate">
                        {campaign.name}
                      </span>
                    </div>
                  </Card>
                )}
              </div>
              {/* Desktop: always show full card */}
              <div className="hidden md:block">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">
                          <Send className="w-4 h-4 text-teal-600" />
                          <span className="truncate">{campaign.name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm truncate">
                          Template: {campaign.template} • Audience:{" "}
                          {campaign.audience}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0 ml-2">
                        {getStatusBadge(campaign.status)}
                        {getTypeBadge(campaign.type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xl font-bold text-gray-900">
                            {campaign.sent.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">Sent</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xl font-bold text-teal-600">
                            {campaign.delivered.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">Delivered</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xl font-bold text-green-600">
                            {calculateOpenRate(
                              campaign.opened,
                              campaign.delivered
                            )}
                            %
                          </p>
                          <p className="text-sm text-gray-600">Open Rate</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xl font-bold text-blue-600">
                            {calculateClickRate(
                              campaign.clicked,
                              campaign.opened
                            )}
                            %
                          </p>
                          <p className="text-sm text-gray-600">Click Rate</p>
                        </div>
                      </div>
                      <ScheduleInfo campaign={campaign} />
                      <CampaignActionButtons campaign={campaign} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
      {campaigns.length > 6 && !showAll && (
        <div className="flex justify-center py-4">
          <button
            className="px-4 py-2 text-xs md:text-sm rounded-full border border-teal-200 text-teal-700 bg-white hover:bg-teal-50 shadow-sm w-full sm:w-auto"
            onClick={() => setShowAll(true)}
          >
            View All Campaigns
          </button>
        </div>
      )}
      {campaigns.length > 6 && showAll && (
        <div className="flex justify-center py-4">
          <button
            className="px-4 py-2 text-xs md:text-sm rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </>
  );
};

export default CampaignsGrid;
