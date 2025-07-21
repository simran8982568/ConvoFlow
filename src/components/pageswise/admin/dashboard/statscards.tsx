import React from 'react';
import { MessageSquare, Users, Send, Zap } from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';

interface DashboardStats {
  totalMessages: string;
  activeContacts: string;
  campaignsSent: string;
  activeAutomations: string;
  messagesTrend: { value: string; isPositive: boolean };
  contactsTrend: { value: string; isPositive: boolean };
  campaignsTrend: { value: string; isPositive: boolean };
  automationsTrend: { value: string; isPositive: boolean };
}

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
  error?: string | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  loading = false,
  error
}) => {
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-4 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading dashboard statistics</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      trend: stats.messagesTrend,
      color: "teal" as const
    },
    {
      title: "Active Contacts",
      value: stats.activeContacts,
      icon: Users,
      trend: stats.contactsTrend,
      color: "blue" as const
    },
    {
      title: "Campaigns Sent",
      value: stats.campaignsSent,
      icon: Send,
      trend: stats.campaignsTrend,
      color: "green" as const
    },
    {
      title: "Active Automations",
      value: stats.activeAutomations,
      icon: Zap,
      trend: stats.automationsTrend,
      color: "purple" as const
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {statsConfig.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsCards;
