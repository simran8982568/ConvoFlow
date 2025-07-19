import React, { useState } from "react";
import {
  Building2,
  Filter,
  Search,
  Eye,
  Calendar,
  TrendingUp,
  MessageSquare,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import HeaderCard from "./headercard";
import BusinessDirectory from "./businessdirectory";
import { useBusinessData } from "../../../../api/apicall/superadmin/businesses/data/businessdata";
import { Business } from "../../../../api/apicall/superadmin/businesses/businessapi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Business type is now imported from API

const SuperAdminBusinesses: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const {
    businesses,
    allBusinesses,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    loadBusinesses,
    updateBusinessStatus,
    deleteBusiness,
    getUniqueIndustries,
    totalBusinesses,
    filteredCount,
    activeCount,
    inactiveCount,
  } = useBusinessData();

  const handleExportCSV = async () => {
    setIsExporting(true);

    try {
      // Create CSV content
      const headers = [
        'Business Name',
        'Email',
        'Phone',
        'Industry',
        'Plan',
        'Status',
        'Signup Date',
        'Last Active',
        'Campaigns',
        'Messages',
        'Automations',
        'Usage %',
        'Website'
      ];

      const csvData = allBusinesses.map(business => [
        business.name,
        business.email || 'N/A',
        business.phone || 'N/A',
        business.industry || 'N/A',
        business.plan,
        business.status,
        business.signupDate,
        business.lastActive || 'N/A',
        business.campaigns,
        business.messages,
        business.automations,
        business.usage,
        business.website || 'N/A'
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `businesses-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${allBusinesses.length} businesses to CSV file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export business data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 hover:bg-green-200"
      >
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        Inactive
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      Free: "bg-gray-100 text-gray-700",
      Starter: "bg-blue-100 text-blue-700",
      Pro: "bg-teal-100 text-teal-700",
      Enterprise: "bg-purple-100 text-purple-700",
    };
    return (
      <Badge
        variant="secondary"
        className={
          colors[plan as keyof typeof colors] || "bg-gray-100 text-gray-700"
        }
      >
        {plan}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Accounts
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all businesses on the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search businesses..."
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className="pl-10 w-64"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || allBusinesses.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <select
            value={filters.planFilter}
            onChange={(e) => updateFilters({ planFilter: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={filters.statusFilter}
            onChange={(e) => updateFilters({ statusFilter: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadBusinesses()}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading businesses...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadBusinesses()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <BusinessDirectory mockBusinesses={allBusinesses} />
      )}

      {/* Businesses Table */}
      {!loading && !error && (
        <HeaderCard
          filteredBusinesses={businesses}
          getPlanBadge={getPlanBadge}
          getStatusBadge={getStatusBadge}
          setSelectedBusiness={setSelectedBusiness}
          updateBusinessStatus={updateBusinessStatus}
          deleteBusiness={deleteBusiness}
        />
      )}
    </div>
  );
};

export default SuperAdminBusinesses;
