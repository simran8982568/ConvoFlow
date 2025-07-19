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
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Automation Analytics</h3>
        <span className="text-sm text-gray-500">Workflow: {workflow.name}</span>
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

        {/* Execution Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Execution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="executions" 
                  stroke="#0D9488" 
                  strokeWidth={2}
                  name="Executions"
                />
                <Line 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="#059669" 
                  strokeWidth={2}
                  name="Completions"
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
            {workflow.totalRuns.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Executions</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {workflow.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(workflow.totalRuns * (workflow.completionRate / 100)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Successful Runs</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(workflow.totalRuns / 30)}
          </div>
          <div className="text-sm text-gray-600">Avg. Daily Runs</div>
        </div>
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
