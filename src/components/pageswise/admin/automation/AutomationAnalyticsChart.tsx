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
import { Workflow } from './types';

interface AutomationAnalyticsChartProps {
  workflow: Workflow;
}

const AutomationAnalyticsChart: React.FC<AutomationAnalyticsChartProps> = ({
  workflow,
}) => {
  // Performance data for bar chart
  const performanceData = [
    { name: 'Started', value: workflow.totalRuns, color: '#3B82F6' },
    { name: 'Completed', value: Math.round(workflow.totalRuns * (workflow.completionRate / 100)), color: '#10B981' },
    { name: 'Failed', value: Math.round(workflow.totalRuns * (1 - workflow.completionRate / 100)), color: '#EF4444' },
  ];

  // Execution over time (mock data)
  const executionData = [
    { day: 'Mon', executions: 45, completions: 38 },
    { day: 'Tue', executions: 52, completions: 44 },
    { day: 'Wed', executions: 38, completions: 32 },
    { day: 'Thu', executions: 61, completions: 55 },
    { day: 'Fri', executions: 48, completions: 41 },
    { day: 'Sat', executions: 35, completions: 30 },
    { day: 'Sun', executions: 29, completions: 25 },
  ];

  // Step completion data
  const stepData = [
    { name: 'Step 1', completed: 100, failed: 0 },
    { name: 'Step 2', completed: 95, failed: 5 },
    { name: 'Step 3', completed: 87, failed: 8 },
    { name: 'Step 4', completed: 82, failed: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{workflow.totalRuns}</div>
          <div className="text-sm text-blue-700">Total Executions</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{workflow.completionRate}%</div>
          <div className="text-sm text-green-700">Completion Rate</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{Math.round(workflow.totalRuns * (workflow.completionRate / 100))}</div>
          <div className="text-sm text-purple-700">Successful Runs</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {workflow.totalRuns > 0 ? '2 hours ago' : 'Never'}
          </div>
          <div className="text-sm text-orange-700">Last Triggered</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#0D9488"
                  radius={[4, 4, 0, 0]}
                  animationBegin={0}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Execution Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Execution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="executions"
                  stroke="#0D9488"
                  strokeWidth={3}
                  name="Executions"
                  dot={{ fill: '#0D9488', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#0D9488', strokeWidth: 2 }}
                  animationBegin={0}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#059669"
                  strokeWidth={3}
                  name="Completions"
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                  animationBegin={200}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Pie Chart and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rate Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Success Rate Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {performanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Additional Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm text-blue-600 font-medium">Trigger Rate</div>
                  <div className="text-xl font-bold text-blue-700">
                    {workflow.totalRuns > 0 ? '98.5%' : '0%'}
                  </div>
                </div>
                <div className="text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm text-green-600 font-medium">Avg. Completion Time</div>
                  <div className="text-xl font-bold text-green-700">
                    {workflow.totalRuns > 0 ? '2.3 min' : 'N/A'}
                  </div>
                </div>
                <div className="text-green-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="text-sm text-orange-600 font-medium">Error Rate</div>
                  <div className="text-xl font-bold text-orange-700">
                    {workflow.totalRuns > 0 ? `${(100 - workflow.completionRate).toFixed(1)}%` : '0%'}
                  </div>
                </div>
                <div className="text-orange-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="text-sm text-purple-600 font-medium">Avg. Daily Runs</div>
                  <div className="text-xl font-bold text-purple-700">
                    {workflow.totalRuns > 0 ? Math.round(workflow.totalRuns / 30) : 0}
                  </div>
                </div>
                <div className="text-purple-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stepData.map((step, index) => (
              <div key={step.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-green-600">{step.completed}% completed</span>
                  <span className="text-sm text-red-600">{step.failed}% failed</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500 bg-green-500"
                      style={{ width: `${step.completed}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trigger Information */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-2">Trigger Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Trigger Event:</span>
            <div className="font-medium">{workflow.trigger}</div>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <div className="font-medium">{workflow.status}</div>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <div className="font-medium">{new Date(workflow.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationAnalyticsChart;
