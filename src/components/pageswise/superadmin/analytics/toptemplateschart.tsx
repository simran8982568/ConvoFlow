import React, { useState } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopTemplateData {
  name: string;
  usage: number;
}

interface TopTemplatesChartProps {
  data: TopTemplateData[];
  loading?: boolean;
  error?: string | null;
}

const TopTemplatesChart: React.FC<TopTemplatesChartProps> = ({
  data,
  loading = false,
  error
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top 5 Used Templates
          </CardTitle>
          <CardDescription>
            Most popular templates across all businesses
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
            <BarChart3 className="h-5 w-5" />
            Top 5 Used Templates
          </CardTitle>
          <CardDescription>
            Most popular templates across all businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            <BarChart3 className="h-5 w-5" />
            Top 5 Used Templates
          </CardTitle>
          <CardDescription>
            Most popular templates across all businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No template data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="space-y-2">
            <p className="font-semibold text-gray-900 text-sm">{`${label}`}</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-blue-600 font-medium">
                {`${payload[0].value.toLocaleString()} uses`}
              </p>
            </div>
            <div className="text-xs text-gray-500 pt-1 border-t">
              Click to view template details
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Top 5 Used Templates
        </CardTitle>
        <CardDescription>
          Most popular templates across all businesses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="horizontal"
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setHoveredIndex(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar
              dataKey="usage"
              radius={[0, 4, 4, 0]}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoveredIndex === index ? '#1D4ED8' : '#3B82F6'}
                  style={{
                    filter: hoveredIndex === index ? 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' : 'none',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopTemplatesChart;
