import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateFiltersProps {
  searchTerm: string;
  filterCategory: string;
  filterType: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
  loading?: boolean;
  filteredCount: number;
  totalCount: number;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  searchTerm,
  filterCategory,
  filterType,
  onSearchChange,
  onCategoryChange,
  onTypeChange,
  onClearFilters,
  loading = false,
  filteredCount,
  totalCount,
}) => {
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Marketing", label: "Marketing" },
    { value: "Utility", label: "Utility" },
    { value: "Authentication", label: "Authentication" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "system", label: "System Templates" },
    { value: "custom", label: "Custom Templates" },
  ];

  const hasActiveFilters =
    searchTerm || filterCategory !== "all" || filterType !== "all";

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
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          disabled={loading}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          disabled={loading}
        >
          {typeOptions.map((option) => (
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
            Showing {filteredCount} of {totalCount} templates
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
              {filterCategory !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Category:{" "}
                  {
                    categoryOptions.find((c) => c.value === filterCategory)
                      ?.label
                  }
                </Badge>
              )}
              {filterType !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {typeOptions.find((t) => t.value === filterType)?.label}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredCount === 0 && hasActiveFilters && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">No templates match your current filters</p>
          <p className="text-sm">
            Try adjusting your search criteria or clearing filters
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateFilters;
