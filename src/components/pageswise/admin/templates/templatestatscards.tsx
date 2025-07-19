import React from 'react';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface TemplateStatsCardsProps {
  stats: TemplateStats;
  loading?: boolean;
  error?: string | null;
}

const TemplateStatsCards: React.FC<TemplateStatsCardsProps> = ({
  stats,
  loading = false,
  error
}) => {
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-4 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading template statistics</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
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

  const statsConfig = [
    {
      title: 'Total Templates',
      value: stats.total,
      icon: FileText,
      color: 'text-gray-900',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => {
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TemplateStatsCards;
