import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { revenueData, paymentTypeData } from './dummydata';

const RevenueAnalytics = ({ filteredRevenueData, filteredPaymentTypeData }) => {
  const [activeChart, setActiveChart] = useState('monthly');
  const [animationKey, setAnimationKey] = useState(0);

  // Ensure data is valid arrays
  const safeRevenueData = Array.isArray(filteredRevenueData) ? filteredRevenueData : [];
  const safePaymentTypeData = Array.isArray(filteredPaymentTypeData) ? filteredPaymentTypeData : [];

  // Trigger animation when chart changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeChart, safeRevenueData, safePaymentTypeData]);

  // Custom tooltip for better formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-teal-600">
            {`Revenue: ₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-teal-600">
            {`Revenue: ₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Revenue Analytics</CardTitle>

          {/* Updated smaller toggle buttons */}
          <div className="flex gap-2">
            <Button
              variant={activeChart === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart('monthly')}
              className="px-3 py-1 text-sm"
            >
              Monthly Revenue
            </Button>
            <Button
              variant={activeChart === 'payment-types' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart('payment-types')}
              className="px-3 py-1 text-sm"
            >
              Payment Type Breakdown
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeChart === 'monthly' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Monthly Revenue (Last 12 Months)</h3>
            {safeRevenueData.length > 0 || revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  key={`monthly-${animationKey}`}
                  data={safeRevenueData.length > 0 ? safeRevenueData : revenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  opacity={0.7}
                />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `₹${(value / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0D9488"
                  strokeWidth={3}
                  dot={{
                    fill: '#0D9488',
                    strokeWidth: 2,
                    r: 5,
                    stroke: '#ffffff'
                  }}
                  activeDot={{
                    r: 7,
                    stroke: '#0D9488',
                    strokeWidth: 3,
                    fill: '#ffffff'
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No revenue data available</p>
              </div>
            )}
          </div>
        )}

        {activeChart === 'payment-types' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Type Breakdown</h3>
            {safePaymentTypeData.length > 0 || paymentTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  key={`payment-${animationKey}`}
                  data={safePaymentTypeData.length > 0 ? safePaymentTypeData : paymentTypeData}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  opacity={0.7}
                />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `₹${(value / 1000)}k`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={120}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: 'rgba(13, 148, 136, 0.1)' }}
                />
                <Bar
                  dataKey="value"
                  fill="#0D9488"
                  radius={[0, 6, 6, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  onMouseEnter={(data, index) => {
                    // Add hover effect
                    const bars = document.querySelectorAll('.recharts-bar-rectangle');
                    if (bars[index]) {
                      bars[index].style.filter = 'brightness(1.1)';
                      bars[index].style.transform = 'scaleX(1.02)';
                      bars[index].style.transformOrigin = 'left center';
                      bars[index].style.transition = 'all 0.2s ease-in-out';
                    }
                  }}
                  onMouseLeave={(data, index) => {
                    // Remove hover effect
                    const bars = document.querySelectorAll('.recharts-bar-rectangle');
                    if (bars[index]) {
                      bars[index].style.filter = 'brightness(1)';
                      bars[index].style.transform = 'scaleX(1)';
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No payment type data available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueAnalytics;