import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, Send, Eye, RefreshCw, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been refreshed successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Wait a moment for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the analytics container
      const analyticsContainer = document.getElementById('analytics-container');
      if (!analyticsContainer) {
        throw new Error('Analytics container not found');
      }

      // Take screenshot using html2canvas
      const canvas = await html2canvas(analyticsContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb',
        width: analyticsContainer.scrollWidth,
        height: analyticsContainer.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Export Successful",
        description: `Analytics report has been downloaded as ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="analytics-container" className="p-4 md:p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Track your messaging performance and campaign effectiveness.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="md:size-default"
            onClick={handleRefresh}
            disabled={isRefreshing || isExporting}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 md:size-default"
            onClick={handleExport}
            disabled={isRefreshing || isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className={`flex items-center text-xs md:text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      stat.changeType === 'negative' ? 'rotate-180' : ''
                    }`} />
                    {stat.change} from last month
                  </div>
                </div>
                <div className={`p-2 md:p-3 rounded-lg ${getColorClass(stat.color)} flex-shrink-0`}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Message Volume Chart */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Message Volume Trends
            </CardTitle>
            <CardDescription className="text-sm">
              Monthly message volume, delivery, and open rates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messageVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    dataKey="messages"
                    stroke="#0d9488"
                    strokeWidth={3}
                    name="Messages Sent"
                    dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#0d9488', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="delivered"
                    stroke="#059669"
                    strokeWidth={3}
                    name="Delivered"
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="opened"
                    stroke="#2563eb"
                    strokeWidth={3}
                    name="Opened"
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Chart */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              Campaign Performance
            </CardTitle>
            <CardDescription className="text-sm">
              Performance metrics by campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="sent" fill="#0d9488" name="Sent" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="delivered" fill="#059669" name="Delivered" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="opened" fill="#2563eb" name="Opened" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="clicked" fill="#7c3aed" name="Clicked" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-semibold text-green-900 text-sm md:text-base">Best Campaign</p>
                </div>
                <p className="text-lg md:text-xl font-bold text-green-900">Holiday Sale</p>
                <p className="text-xs md:text-sm text-green-700 mt-1">20% click rate • 2,100 sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-semibold text-blue-900 text-sm md:text-base">Response Time</p>
                </div>
                <p className="text-lg md:text-xl font-bold text-blue-900">2.3 hours</p>
                <p className="text-xs md:text-sm text-blue-700 mt-1">15% faster than last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-semibold text-purple-900 text-sm md:text-base">Peak Hours</p>
                </div>
                <p className="text-lg md:text-xl font-bold text-purple-900">2-4 PM</p>
                <p className="text-xs md:text-sm text-purple-700 mt-1">Weekdays • Best engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Key Insights</CardTitle>
          <CardDescription className="text-sm">
            Important trends and recommendations for your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                <div className="p-1 bg-teal-500 rounded-full mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-teal-900 text-sm">Delivery Rate Improved</p>
                  <p className="text-xs text-teal-700 mt-1">Your delivery rate increased by 2.1% this month, reaching 96.8%</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="p-1 bg-orange-500 rounded-full mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-orange-900 text-sm">Open Rate Declined</p>
                  <p className="text-xs text-orange-700 mt-1">Consider A/B testing subject lines to improve engagement</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="p-1 bg-indigo-500 rounded-full mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-indigo-900 text-sm">Contact Growth</p>
                  <p className="text-xs text-indigo-700 mt-1">Added 267 new contacts this month (+8.3% growth)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="p-1 bg-emerald-500 rounded-full mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-emerald-900 text-sm">Automation Success</p>
                  <p className="text-xs text-emerald-700 mt-1">23 active automations with 94% success rate</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
