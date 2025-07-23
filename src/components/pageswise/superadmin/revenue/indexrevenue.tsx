import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Search,
  Filter,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  Clock,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Mock data for revenue analytics
const revenueData = [
  { month: 'Jan', revenue: 85000 },
  { month: 'Feb', revenue: 92000 },
  { month: 'Mar', revenue: 78000 },
  { month: 'Apr', revenue: 105000 },
  { month: 'May', revenue: 125000 },
  { month: 'Jun', revenue: 120000 },
];

const paymentTypeData = [
  { name: 'Subscriptions', value: 750000, color: '#0D9488' },
  { name: 'Campaign Boosts', value: 350000, color: '#059669' },
  { name: 'Add-ons', value: 150000, color: '#10B981' },
];

const transactionData = [
  {
    id: 'TXN1234',
    businessName: 'Sophia Carter',
    email: 'sophia.carter@email.com',
    paymentDate: '2024-07-18',
    amount: 500,
    paymentType: 'Subscription',
    status: 'Complete',
  },
  {
    id: 'TXN1890',
    businessName: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    paymentDate: '2024-07-18',
    amount: 1200,
    paymentType: 'Campaign Boost',
    status: 'Complete',
  },
  {
    id: 'TXN1223',
    businessName: 'Liam Bennett',
    email: 'liam.bennett@email.com',
    paymentDate: '2024-07-17',
    amount: 750,
    paymentType: 'Add-on',
    status: 'Complete',
  },
  {
    id: 'TXN4556',
    businessName: 'Global Marketing Ltd.',
    email: 'info@globalmarketing.com',
    paymentDate: '2024-07-17',
    amount: 2500,
    paymentType: 'Subscription',
    status: 'Complete',
  },
  {
    id: 'TXN7889',
    businessName: 'Olivia Harper',
    email: 'olivia.harper@email.com',
    paymentDate: '2024-07-16',
    amount: 300,
    paymentType: 'Add-on',
    status: 'Complete',
  },
  {
    id: 'TXN8901',
    businessName: 'Creative Solutions',
    email: 'support@creativesolutions.com',
    paymentDate: '2024-07-16',
    amount: 800,
    paymentType: 'Campaign Boost',
    status: 'Complete',
  },
  {
    id: 'TXN2334',
    businessName: 'Ethan Walker',
    email: 'ethan.walker@email.com',
    paymentDate: '2024-07-15',
    amount: 1500,
    paymentType: 'Add-on',
    status: 'Complete',
  },
  {
    id: 'TXN8890',
    businessName: 'Innovative Solutions LLC',
    email: 'sales@innovativesolutions.com',
    paymentDate: '2024-07-15',
    amount: 500,
    paymentType: 'Add-on',
    status: 'Complete',
  },
  {
    id: 'TXN1224',
    businessName: 'Dynamic Enterprises',
    email: 'contact@dynamicenterprises.com',
    paymentDate: '2024-07-14',
    amount: 1000,
    paymentType: 'Campaign Boost',
    status: 'Complete',
  },
];

const SuperAdminRevenue: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');

  const filteredTransactions = transactionData.filter((transaction) => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      transaction.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Date filter
    const transactionDate = new Date(transaction.paymentDate);
    const today = new Date();
    let matchesDate = true;

    if (dateFilter === 'today') {
      matchesDate = transactionDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = transactionDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = transactionDate >= monthAgo;
    }

    // Payment type filter
    const matchesPaymentType = paymentTypeFilter === 'all' ||
      transaction.paymentType === paymentTypeFilter;

    return matchesSearch && matchesDate && matchesPaymentType;
  });

  // Calculate filtered metrics
  const filteredRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const filteredTransactionCount = filteredTransactions.length;

  // Calculate filtered payment type breakdown
  const filteredPaymentTypeData = [
    {
      name: 'Subscriptions',
      value: filteredTransactions
        .filter(t => t.paymentType === 'Subscription')
        .reduce((sum, t) => sum + t.amount, 0),
      color: '#0D9488'
    },
    {
      name: 'Campaign Boosts',
      value: filteredTransactions
        .filter(t => t.paymentType === 'Campaign Boost')
        .reduce((sum, t) => sum + t.amount, 0),
      color: '#059669'
    },
    {
      name: 'Add-ons',
      value: filteredTransactions
        .filter(t => t.paymentType === 'Add-on')
        .reduce((sum, t) => sum + t.amount, 0),
      color: '#10B981'
    },
  ].filter(item => item.value > 0); // Only show categories with data

  // Calculate filtered monthly revenue (group by month)
  const filteredMonthlyRevenue = filteredTransactions.reduce((acc, transaction) => {
    const month = new Date(transaction.paymentDate).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const filteredRevenueData = Object.entries(filteredMonthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue
  }));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const tableElement = document.getElementById('transaction-table');
      if (tableElement) {
        const canvas = await html2canvas(tableElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 280;
        const pageHeight = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 10;
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('revenue-transactions.pdf');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revenue Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor platform revenue and transaction analytics.
        </p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {dateFilter === 'all' ? 'Total Revenue' :
                   dateFilter === 'today' ? 'Today\'s Revenue' :
                   dateFilter === 'week' ? 'Week\'s Revenue' :
                   'Month\'s Revenue'}
                </p>
                <p className="text-2xl font-bold text-gray-900">₹{filteredRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+10%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹120,000</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+5%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {dateFilter === 'all' ? 'Total Transactions' :
                   dateFilter === 'today' ? 'Today\'s Transactions' :
                   dateFilter === 'week' ? 'Week\'s Transactions' :
                   'Month\'s Transactions'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{filteredTransactionCount.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Settlements</p>
                <p className="text-2xl font-bold text-gray-900">₹15,000</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600 font-medium">-2%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
              <TabsTrigger value="payment-types">Payment Type Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Monthly Revenue (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredRevenueData.length > 0 ? filteredRevenueData : revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0D9488" 
                      strokeWidth={3}
                      dot={{ fill: '#0D9488', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#0D9488', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="payment-types" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Type Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredPaymentTypeData.length > 0 ? filteredPaymentTypeData : paymentTypeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="value" fill="#0D9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Transaction Details</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="Subscription">Subscription</option>
                <option value="Campaign Boost">Campaign Boost</option>
                <option value="Add-on">Add-on</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div id="transaction-table" className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User/Business Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.businessName}</TableCell>
                    <TableCell className="text-gray-600">{transaction.email}</TableCell>
                    <TableCell>{transaction.paymentDate}</TableCell>
                    <TableCell className="font-semibold">₹{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          transaction.paymentType === 'Subscription'
                            ? 'bg-blue-100 text-blue-800'
                            : transaction.paymentType === 'Campaign Boost'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }
                      >
                        {transaction.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminRevenue;
