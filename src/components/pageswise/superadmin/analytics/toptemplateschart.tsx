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
      const currentData = payload[0].payload;
      const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
      const percentage = ((currentData.usage / totalUsage) * 100).toFixed(1);

      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="space-y-3">
            <div className="border-b pb-2">
              <p className="font-semibold text-gray-900 text-base">{`${label}`}</p>
              <p className="text-xs text-gray-500">Template Usage Analytics</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Usage Count:</span>
                </div>
                <span className="text-blue-600 font-bold text-lg">
                  {payload[0].value.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Share:</span>
                </div>
                <span className="text-green-600 font-bold text-lg">
                  {percentage}%
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t flex items-center gap-1">
              <span className="animate-bounce">👆</span>
              <span>Click to view template details</span>
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
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top 5 Used Templates
          </CardTitle>
          <CardDescription>
            Most popular templates across all businesses
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" data-testid="top-templates-chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
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
              radius={[0, 6, 6, 0]}
              animationBegin={200}
              animationDuration={2000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => {
                const isHovered = hoveredIndex === index;
                const baseColor = '#3B82F6';
                const hoverColor = '#1D4ED8';
                const glowColor = 'rgba(59, 130, 246, 0.4)';

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isHovered ? hoverColor : baseColor}
                    style={{
                      filter: isHovered
                        ? `drop-shadow(0 6px 12px ${glowColor}) brightness(1.1)`
                        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      transformOrigin: 'center'
                    }}
                  />
                );
              })}
            </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Hover indicator */}
          {hoveredIndex !== null && (
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium animate-in fade-in-0 slide-in-from-right-2 duration-200">
              #{hoveredIndex + 1} Most Used
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTemplatesChart;
