import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RecentActivity: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Platform Activity</CardTitle>
      <CardDescription>
        Latest business registrations and system updates
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
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
        ].map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{activity.event}</p>
              <p className="text-sm text-gray-600">{activity.business}</p>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default RecentActivity;
