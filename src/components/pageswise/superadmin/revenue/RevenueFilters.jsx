import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Search, Download, FileText } from 'lucide-react';

const RevenueFilters = ({ 
  onDateRangeChange, 
  onCategoryChange, 
  onSearchChange,
  onExportCSV,
  onExportPDF,
  isExporting 
}) => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange]);

  const handleDateFromChange = (e) => {
    const newDateRange = { ...dateRange, from: e.target.value };
    setDateRange(newDateRange);
    onDateRangeChange(newDateRange);
  };

  const handleDateToChange = (e) => {
    const newDateRange = { ...dateRange, to: e.target.value };
    setDateRange(newDateRange);
    onDateRangeChange(newDateRange);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  const clearFilters = () => {
    setDateRange({ from: '', to: '' });
    setCategory('all');
    setSearchTerm('');
    onDateRangeChange({ from: '', to: '' });
    onCategoryChange('all');
    onSearchChange('');
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear All
            </Button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={handleDateFromChange}
                    className="pl-10 text-sm"
                    placeholder="From"
                  />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={handleDateToChange}
                    className="pl-10 text-sm"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="subscription">Subscription</option>
                <option value="one-time">One-Time</option>
                <option value="campaign-boost">Campaign Boost</option>
                <option value="add-on">Add-on</option>
              </select>
            </div>

            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search transactions..."
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Export Data</label>
              <div className="flex gap-2">
                <Button
                  onClick={onExportCSV}
                  disabled={isExporting}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  CSV
                </Button>
                <Button
                  onClick={onExportPDF}
                  disabled={isExporting}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(dateRange.from || dateRange.to || category !== 'all' || searchDebounce) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {dateRange.from && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                  From: {dateRange.from}
                </span>
              )}
              {dateRange.to && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                  To: {dateRange.to}
                </span>
              )}
              {category !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Category: {category}
                </span>
              )}
              {searchDebounce && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Search: "{searchDebounce}"
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueFilters;
