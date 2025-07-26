import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const allActivities = [
  {
    event: "New business registered",
    business: "TechCorp Solutions",
    time: "2 hours ago",
  },
  {
    event: "Template approved",
    business: "Marketing Pro",
    time: "4 hours ago",
  },
  {
    event: "Plan upgraded to Enterprise",
    business: "Global Retail",
    time: "6 hours ago",
  },
  {
    event: "New business registered",
    business: "StartupXYZ",
    time: "8 hours ago",
  },
  {
    event: "Template submitted for review",
    business: "E-commerce Plus",
    time: "12 hours ago",
  },
  {
    event: "Template submitted for review",
    business: "E-commerce Plus",
    time: "12 hours ago",
  },
];

const RecentActivity: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleActivities = showAll ? allActivities : allActivities.slice(0, 5);
  return (
    <Card className="w-full max-w-xl mx-auto sm:mx-0">
      <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-base sm:text-lg">
          Recent Platform Activity
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest business registrations and system updates
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-3 sm:px-6 sm:py-4">
        <div className="space-y-2 sm:space-y-3">
          {visibleActivities.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-2 sm:p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {activity.event}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {activity.business}
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {activity.time}
              </span>
            </div>
          ))}
          {!showAll && allActivities.length > 5 && (
            <button
              className="w-full mt-2 py-2 rounded-lg bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition text-sm sm:text-base"
              onClick={() => setShowAll(true)}
            >
              View All
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
