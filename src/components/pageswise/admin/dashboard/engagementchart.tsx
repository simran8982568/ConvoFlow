import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EngagementData {
  name: string;
  messages: number;
  delivered: number;
  replies: number;
}

interface EngagementChartProps {
  data: EngagementData[];
  loading?: boolean;
  error?: string | null;
}

const EngagementChart: React.FC<EngagementChartProps> = ({
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
            WhatsApp Engagement
          </CardTitle>
          <CardDescription>
            Messages sent, delivered, and replies over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-red-600">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Error loading engagement data</p>
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
            WhatsApp Engagement
          </CardTitle>
          <CardDescription>
            Messages sent, delivered, and replies over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
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
            WhatsApp Engagement
          </CardTitle>
          <CardDescription>
            Messages sent, delivered, and replies over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No engagement data available</p>
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
              {`${entry.name}: ${entry.value.toLocaleString()}`}
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
          WhatsApp Engagement
        </CardTitle>
        <CardDescription>
          Messages sent, delivered, and replies over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="messages" 
              stroke="#0d9488" 
              strokeWidth={2}
              name="Messages Sent"
              dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0d9488', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="delivered" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Delivered"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="replies" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Replies"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-600" />
            <span className="text-sm text-gray-600">Messages Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-sm text-gray-600">Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm text-gray-600">Replies</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
