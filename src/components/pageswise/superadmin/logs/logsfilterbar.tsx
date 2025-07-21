import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LogsFilterBarProps {
  searchTerm: string;
  filterModule: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  loading?: boolean;
  filteredCount: number;
  totalCount: number;
}

const LogsFilterBar: React.FC<LogsFilterBarProps> = ({
  searchTerm,
  filterModule,
  filterStatus,
  onSearchChange,
  onModuleChange,
  onStatusChange,
  onClearFilters,
  loading = false,
  filteredCount,
  totalCount
}) => {
  const moduleOptions = [
    { value: 'all', label: 'All Modules' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'campaigns', label: 'Campaigns' },
    { value: 'templates', label: 'Templates' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'billing', label: 'Billing' },
    { value: 'automation', label: 'Automation' },
    { value: 'contacts', label: 'Contacts' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' }
  ];

  const hasActiveFilters = searchTerm || filterModule !== 'all' || filterStatus !== 'all';

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse sm:w-64" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        
        <select
          value={filterModule}
          onChange={(e) => onModuleChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          disabled={loading}
        >
          {moduleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          disabled={loading}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} logs
          </span>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            <div className="flex gap-1">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {filterModule !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Module: {moduleOptions.find(m => m.value === filterModule)?.label}
                </Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Status: {statusOptions.find(s => s.value === filterStatus)?.label}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredCount === 0 && hasActiveFilters && (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">No logs match your current filters</p>
          <p className="text-sm">Try adjusting your search criteria or clearing filters</p>
        </div>
      )}
    </div>
  );
};

export default LogsFilterBar;
