import React from 'react';
import { Activity, Clock, AlertCircle, Building, FileText, CreditCard, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: number;
  event: string;
  business: string;
  time: string;
  type: 'registration' | 'template' | 'upgrade' | 'submission';
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  loading?: boolean;
  error?: string | null;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  loading = false,
  error
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'template':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'upgrade':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'submission':
        return <Building className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    const badgeConfig = {
      registration: { color: 'bg-green-100 text-green-700 border-green-200', label: 'New' },
      template: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Approved' },
      upgrade: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Upgrade' },
      submission: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Review' }
    };

    const config = badgeConfig[type as keyof typeof badgeConfig] || 
                  { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Activity' };

    return (
      <Badge variant="secondary" className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
          <CardDescription>
            Latest business registrations and system updates
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
          <CardTitle>Recent Platform Activity</CardTitle>
          <CardDescription>
            Latest business registrations and system updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
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
          <CardTitle>Recent Platform Activity</CardTitle>
          <CardDescription>
            Latest business registrations and system updates
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
          <Activity className="h-5 w-5" />
          Recent Platform Activity
          <span className="ml-auto text-sm font-normal text-gray-500">
            {activities.length} recent events
          </span>
        </CardTitle>
        <CardDescription>
          Latest business registrations and system updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 truncate">
                      {activity.event}
                    </p>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.business}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View all activity →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
