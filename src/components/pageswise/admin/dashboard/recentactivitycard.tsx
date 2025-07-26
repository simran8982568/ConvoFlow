import React, { useState } from "react";
import { Clock, AlertCircle, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActivityItem {
  id: number;
  campaign: string;
  status: "Active" | "Completed" | "Scheduled";
  sent: number;
  delivered: number;
  time: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  loading?: boolean;
  error?: string | null;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  loading = false,
  error,
}) => {
  const [showAll, setShowAll] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Campaign Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your active campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-red-600">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Error loading activity data</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Campaign Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your active campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2" />
                  <div className="flex items-center gap-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Campaign Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your active campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Campaign Activity
          <span className="ml-auto text-sm font-normal text-gray-500">
            {activities.length} recent campaigns
          </span>
        </CardTitle>
        <CardDescription>
          Latest updates from your active campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(showAll ? activities : activities.slice(0, 5)).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.campaign}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                  {activity.sent > 0 && (
                    <span className="text-sm text-gray-600">
                      Sent: {activity.sent.toLocaleString()} | Delivered:{" "}
                      {activity.delivered.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 flex-shrink-0">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
        {/* Responsive View All/Show Less Button */}
        {activities.length > 5 && !showAll && (
          <div className="mt-4 text-center">
            <button
              className="text-sm text-teal-600 hover:text-teal-700 font-medium px-4 py-2 rounded-full border border-teal-200 shadow-sm w-full sm:w-auto"
              onClick={() => setShowAll(true)}
            >
              View All Activity
            </button>
          </div>
        )}
        {activities.length > 5 && showAll && (
          <div className="mt-4 text-center">
            <button
              className="text-sm text-gray-600 hover:text-gray-700 font-medium px-4 py-2 rounded-full border border-gray-200 w-full sm:w-auto"
              onClick={() => setShowAll(false)}
            >
              Show Less
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
