import React from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, Send, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminAnalytics: React.FC = () => {
  // Mock data for analytics
  const messageVolumeData = [
    { name: 'Jan', messages: 4000, delivered: 3800, opened: 2400 },
    { name: 'Feb', messages: 3000, delivered: 2900, opened: 1800 },
    { name: 'Mar', messages: 2000, delivered: 1950, opened: 1200 },
    { name: 'Apr', messages: 2780, delivered: 2700, opened: 1600 },
    { name: 'May', messages: 1890, delivered: 1820, opened: 1100 },
    { name: 'Jun', messages: 2390, delivered: 2300, opened: 1400 },
  ];

  const campaignPerformanceData = [
    { name: 'Welcome Series', sent: 1250, delivered: 1180, opened: 890, clicked: 234 },
    { name: 'Product Launch', sent: 890, delivered: 856, opened: 645, clicked: 178 },
    { name: 'Holiday Sale', sent: 2100, delivered: 2050, opened: 1540, clicked: 420 },
    { name: 'Cart Abandonment', sent: 156, delivered: 149, opened: 112, clicked: 34 },
  ];

  const stats = [
    {
      title: "Total Messages Sent",
      value: "24,567",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: MessageSquare,
      color: "teal"
    },
    {
      title: "Delivery Rate",
      value: "96.8%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Send,
      color: "green"
    },
    {
      title: "Open Rate",
      value: "68.4%",
      change: "-1.2%",
      changeType: "negative" as const,
      icon: Eye,
      color: "blue"
    },
    {
      title: "Active Contacts",
      value: "3,247",
      change: "+8.3%",
      changeType: "positive" as const,
      icon: Users,
      color: "purple"
    }
  ];

  const getColorClass = (color: string) => {
    const colors = {
      teal: "bg-teal-50 text-teal-600",
      green: "bg-green-50 text-green-600",
      blue: "bg-blue-50 text-blue-600",
      purple: "bg-purple-50 text-purple-600"
    };
    return colors[color as keyof typeof colors] || colors.teal;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your messaging performance and campaign effectiveness.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClass(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Message Volume Trends
            </CardTitle>
            <CardDescription>
              Monthly message volume, delivery, and open rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messageVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#0d9488" 
                    strokeWidth={2}
                    name="Messages Sent"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delivered" 
                    stroke="#059669" 
                    strokeWidth={2}
                    name="Delivered"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Opened"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
            <CardDescription>
              Performance metrics by campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#0d9488" name="Sent" />
                  <Bar dataKey="delivered" fill="#059669" name="Delivered" />
                  <Bar dataKey="opened" fill="#2563eb" name="Opened" />
                  <Bar dataKey="clicked" fill="#7c3aed" name="Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>
            Key insights from your messaging campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Best Performing Campaign</p>
                <p className="text-sm text-green-700">Holiday Sale - 20% click rate</p>
              </div>
              <div className="text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Average Response Time</p>
                <p className="text-sm text-blue-700">2.3 hours - 15% faster than last month</p>
              </div>
              <div className="text-blue-600">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Peak Activity Time</p>
                <p className="text-sm text-purple-700">2:00 PM - 4:00 PM weekdays</p>
              </div>
              <div className="text-purple-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
