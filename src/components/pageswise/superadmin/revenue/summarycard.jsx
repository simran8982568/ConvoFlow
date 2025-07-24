import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({
  title,
  value,
  growth,
  icon: Icon,
  iconColor,
  iconBgColor,
  currency = true
}) => {
  const isPositive = growth >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const trendIconColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {currency ? '₹' : ''}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className="flex items-center">
              <TrendIcon className={`h-4 w-4 ${trendIconColor} mr-1`} />
              <span className={`text-sm font-medium ${trendColor}`}>
                {isPositive ? '+' : ''}{growth}%
              </span>
            </div>
          </div>
          <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;