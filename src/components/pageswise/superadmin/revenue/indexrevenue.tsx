import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import modular components
import SummaryCard from './summarycard';
import RevenueAnalytics from './revenueanalytics';
import TransactionDetails from './transactiondetails';
import RevenueFilters from './RevenueFilters';
import RevenueErrorBoundary from './RevenueErrorBoundary';
import { summaryMetrics, transactionData, revenueData, paymentTypeData } from './dummydata';
import { filterRevenueData, exportRevenueDataToCSV, exportRevenueToPDF } from '../../../../utils/exportUtils';

// Clean exports for maintainability
export { default as SummaryCard } from './summarycard';
export { default as RevenueAnalytics } from './revenueanalytics';
export { default as TransactionDetails } from './transactiondetails';

const SuperAdminRevenue: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: { from: '', to: '' },
    category: 'all',
    search: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [filteredData, setFilteredData] = useState(transactionData || []);

  // Update filtered data when filters change
  useEffect(() => {
    try {
      const filtered = filterRevenueData(transactionData || [], filters);
      setFilteredData(Array.isArray(filtered) ? filtered : []);
    } catch (error) {
      console.error('Error filtering revenue data:', error);
      setFilteredData([]);
    }
  }, [filters]);

  // Calculate filtered metrics for charts with error handling
  const filteredRevenueData = React.useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      return {};
    }

    return filteredData.reduce((acc, transaction) => {
      if (!transaction || !transaction.paymentDate || typeof transaction.amount !== 'number') {
        return acc;
      }

      try {
        const month = new Date(transaction.paymentDate).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += transaction.amount;
      } catch (error) {
        console.error('Error processing transaction date:', error);
      }
      return acc;
    }, {});
  }, [filteredData]);

  const chartRevenueData = React.useMemo(() => {
    return Object.entries(filteredRevenueData).map(([month, revenue]) => ({
      month,
      revenue: Number(revenue) || 0
    }));
  }, [filteredRevenueData]);

  const filteredPaymentTypeData = React.useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      return [];
    }

    const paymentTypes = [
      {
        name: 'Subscriptions',
        value: filteredData
          .filter(t => t && t.paymentType === 'Subscription' && typeof t.amount === 'number')
          .reduce((sum, t) => sum + t.amount, 0),
        color: '#0D9488'
      },
      {
        name: 'Campaign Boosts',
        value: filteredData
          .filter(t => t && t.paymentType === 'Campaign Boost' && typeof t.amount === 'number')
          .reduce((sum, t) => sum + t.amount, 0),
        color: '#059669'
      },
      {
        name: 'Add-ons',
        value: filteredData
          .filter(t => t && t.paymentType === 'Add-on' && typeof t.amount === 'number')
          .reduce((sum, t) => sum + t.amount, 0),
        color: '#10B981'
      },
    ];

    return paymentTypes.filter(item => item.value > 0);
  }, [filteredData]);

  // Filter handlers
  const handleDateRangeChange = (dateRange: { from: string; to: string }) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  // Export handlers
  const handleExportCSV = async () => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      console.warn('No data available for CSV export');
      return;
    }

    setIsExporting(true);
    try {
      exportRevenueDataToCSV(filteredData, filters);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      console.warn('No data available for PDF export');
      return;
    }

    setIsExporting(true);
    try {
      await exportRevenueToPDF(filters);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600 mt-1">Track revenue performance and transaction details</p>
        </div>
      </div>

      {/* Filters Section */}
      <RevenueFilters
        onDateRangeChange={handleDateRangeChange}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={summaryMetrics.totalRevenue}
          growth={summaryMetrics.growthRates.revenue}
          icon={DollarSign}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <SummaryCard
          title="Monthly Revenue"
          value={summaryMetrics.monthlyRevenue}
          growth={summaryMetrics.growthRates.monthly}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <SummaryCard
          title="Total Transactions"
          value={summaryMetrics.totalTransactions}
          growth={summaryMetrics.growthRates.transactions}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          currency={false}
        />
        <SummaryCard
          title="Pending Settlements"
          value={summaryMetrics.pendingSettlements}
          growth={summaryMetrics.growthRates.settlements}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Revenue Analytics Chart */}
      <RevenueErrorBoundary>
        <RevenueAnalytics
          filteredRevenueData={chartRevenueData}
          filteredPaymentTypeData={filteredPaymentTypeData}
        />
      </RevenueErrorBoundary>

      {/* Enhanced Filters & Search Block */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({ dateRange: { from: '', to: '' }, category: 'all', search: '' });
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Date Range Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="mm/dd/yyyy"
                />
                <span className="text-xs text-gray-500">Start Date</span>
              </div>
              <div>
                <input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="mm/dd/yyyy"
                />
                <span className="text-xs text-gray-500">End Date</span>
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              <option value="subscription">Subscriptions</option>
              <option value="marketing">Marketing</option>
              <option value="campaign-boost">Campaign Boost</option>
              <option value="add-on">Add-on</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search transactions..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Export Data</label>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? 'Exporting...' : 'CSV'}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? 'Exporting...' : 'PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.dateRange.from || filters.dateRange.to || filters.category !== 'all' || filters.search) && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.dateRange.from && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                From: {filters.dateRange.from}
              </span>
            )}
            {filters.dateRange.to && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                To: {filters.dateRange.to}
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Category: {filters.category}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Search: "{filters.search}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <RevenueErrorBoundary>
        <TransactionDetails
          filteredTransactionData={filteredData}
          searchTerm={filters.search}
        />
      </RevenueErrorBoundary>
    </div>
  );
};

export default SuperAdminRevenue;