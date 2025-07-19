import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BusinessGrowthData {
  month: string;
  new: number;
  total: number;
}

interface BusinessGrowthChartProps {
  data: BusinessGrowthData[];
  loading?: boolean;
  error?: string | null;
}

const BusinessGrowthChart: React.FC<BusinessGrowthChartProps> = ({ 
  data, 
  loading = false, 
  error 
}) => {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Growth Monthly
          </CardTitle>
          <CardDescription>
            New business registrations and cumulative total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-red-600">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Error loading chart data</p>
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
            <TrendingUp className="h-5 w-5" />
            Business Growth Monthly
          </CardTitle>
          <CardDescription>
            New business registrations and cumulative total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Growth Monthly
          </CardTitle>
          <CardDescription>
            New business registrations and cumulative total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No business growth data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey === 'new' ? 'New Businesses' : 'Total Businesses'}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Business Growth Monthly
        </CardTitle>
        <CardDescription>
          New business registrations and cumulative total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="new" 
              stackId="1" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
              fillOpacity={0.6}
              name="New Businesses"
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stackId="2" 
              stroke="#0D9488" 
              fill="#0D9488" 
              fillOpacity={0.3}
              name="Total Businesses"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 opacity-60" />
            <span className="text-sm text-gray-600">New Businesses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500 opacity-30" />
            <span className="text-sm text-gray-600">Total Businesses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessGrowthChart;
