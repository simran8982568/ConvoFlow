import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SuperAdminStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
}

const SuperAdminStatsCard: React.FC<SuperAdminStatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'purple',
  size = 'md'
}) => {
  const colorClasses = {
    purple: 'text-purple-600 bg-purple-50',
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(description || trend) && (
          <div className="flex items-center justify-between mt-3">
            {description && (
              <p className="text-xs text-gray-500 flex-1">{description}</p>
            )}
            {trend && (
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                trend.isPositive 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuperAdminStatsCard;
