import React from 'react';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  module: string;
  status: string;
  message: string;
  ip: string;
}

interface LogsStatsCardProps {
  logs: LogEntry[];
  loading?: boolean;
  error?: string | null;
}

const LogsStatsCard: React.FC<LogsStatsCardProps> = ({ 
  logs, 
  loading = false, 
  error 
}) => {
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-4 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading log statistics</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalEvents = logs.length;
  const successfulEvents = logs.filter(l => l.status === 'Success').length;
  const failedEvents = logs.filter(l => l.status === 'Failed').length;
  
  // Calculate events in the last hour
  const lastHourEvents = logs.filter(l => {
    const logTime = new Date(l.timestamp);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return logTime > oneHourAgo;
  }).length;

  const successRate = totalEvents > 0 ? ((successfulEvents / totalEvents) * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents.toLocaleString(),
      icon: Activity,
      color: 'text-gray-900',
      bgColor: 'bg-gray-50',
      description: 'All logged activities'
    },
    {
      title: 'Successful',
      value: successfulEvents.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${successRate}% success rate`
    },
    {
      title: 'Failed',
      value: failedEvents.toLocaleString(),
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Requires attention'
    },
    {
      title: 'Last Hour',
      value: lastHourEvents.toLocaleString(),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Recent activity'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className={`border-l-4 ${stat.color.replace('text-', 'border-')}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${stat.color} flex items-center gap-2`}>
                <IconComponent className="h-4 w-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LogsStatsCard;
