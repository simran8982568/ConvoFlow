import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign } from './mockdata';

interface CampaignAnalyticsChartProps {
  campaign: Campaign;
}

const CampaignAnalyticsChart: React.FC<CampaignAnalyticsChartProps> = ({
  campaign,
}) => {
  // Performance data for bar chart
  const performanceData = [
    { name: 'Sent', value: campaign.sent, color: '#3B82F6' },
    { name: 'Delivered', value: campaign.delivered, color: '#10B981' },
    { name: 'Opened', value: campaign.opened, color: '#F59E0B' },
    { name: 'Clicked', value: campaign.clicked, color: '#EF4444' },
  ];

  // Engagement over time (mock data)
  const engagementData = [
    { day: 'Day 1', opens: 120, clicks: 25 },
    { day: 'Day 2', opens: 180, clicks: 42 },
    { day: 'Day 3', opens: 220, clicks: 58 },
    { day: 'Day 4', opens: 190, clicks: 48 },
    { day: 'Day 5', opens: 170, clicks: 61 },
  ];

  // Conversion funnel data
  const funnelData = [
    { name: 'Sent', value: campaign.sent, percentage: 100 },
    { name: 'Delivered', value: campaign.delivered, percentage: Math.round((campaign.delivered / campaign.sent) * 100) },
    { name: 'Opened', value: campaign.opened, percentage: Math.round((campaign.opened / campaign.sent) * 100) },
    { name: 'Clicked', value: campaign.clicked, percentage: Math.round((campaign.clicked / campaign.sent) * 100) },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Campaign Analytics</h3>
        <span className="text-sm text-gray-500">Campaign: {campaign.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0D9488" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="opens" 
                  stroke="#0D9488" 
                  strokeWidth={2}
                  name="Opens"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#DC2626" 
                  strokeWidth={2}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((campaign.delivered / campaign.sent) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Delivery Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((campaign.opened / campaign.delivered) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Open Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((campaign.clicked / campaign.opened) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Click Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((campaign.clicked / campaign.sent) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{item.value.toLocaleString()}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalyticsChart;
