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
  Mail,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const SuperAdminBusinesses: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    description: `Hi {{name}},

We're excited to invite you to join ConvoFlow - our comprehensive WhatsApp automation platform designed to help businesses like yours streamline communication and boost engagement.

ConvoFlow Features:
✅ WhatsApp Business API Integration
✅ Automated Message Campaigns
✅ Smart Template Management
✅ Real-time Analytics & Reports
✅ Multi-user Team Collaboration
✅ Advanced Customer Segmentation

Transform your customer communication with our powerful automation tools. Get started today and experience the difference!

Best regards,
ConvoFlow Team

Ready to get started? Click the link below to begin your journey with ConvoFlow.`
  });

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

  const handleInviteFormChange = (field: string, value: string) => {
    setInviteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendInvite = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and email fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteForm.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const personalizedDescription = inviteForm.description.replace(/\{\{name\}\}/g, inviteForm.name);

      console.log('Sending invite:', {
        name: inviteForm.name,
        email: inviteForm.email,
        description: personalizedDescription
      });

      toast({
        title: "Invite Sent Successfully!",
        description: `Invitation has been sent to ${inviteForm.email}`,
      });

      setInviteForm({
        name: '',
        email: '',
        description: `Hi {{name}},

We're excited to invite you to join ConvoFlow - our comprehensive WhatsApp automation platform designed to help businesses like yours streamline communication and boost engagement.

ConvoFlow Features:
✅ WhatsApp Business API Integration
✅ Automated Message Campaigns
✅ Smart Template Management
✅ Real-time Analytics & Reports
✅ Multi-user Team Collaboration
✅ Advanced Customer Segmentation

Transform your customer communication with our powerful automation tools. Get started today and experience the difference!

Best regards,
ConvoFlow Team

Ready to get started? Click the link below to begin your journey with ConvoFlow.`
      });

      setShowInviteModal(false);
    } catch (error) {
      toast({
        title: "Invite Failed",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);

    try {
      const headers = [
        "Business Name",
        "Email",
        "Phone",
        "Industry",
        "Plan",
        "Status",
        "Signup Date",
        "Last Active",
        "Campaigns",
        "Messages",
        "Automations",
        "Usage %",
        "Website",
      ];

      const csvData = allBusinesses.map((business) => [
        business.name,
        business.email || "N/A",
        business.phone || "N/A",
        business.industry || "N/A",
        business.plan,
        business.status,
        business.signupDate,
        business.lastActive || "N/A",
        business.campaigns,
        business.messages,
        business.automations,
        business.usage,
        business.website || "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `businesses-export-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* NEW: Invite Button */}
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 px-3 py-2 text-sm"
          >
            <Mail className="h-4 w-4" />
            Invite
          </Button>

          <div className="relative w-40 sm:w-64">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-4 sm:w-4" />
            <Input
              placeholder="Search businesses..."
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className="pl-8 pr-2 py-2 w-full text-sm sm:pl-10 sm:w-64 sm:text-base"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || allBusinesses.length === 0}
            className="flex items-center gap-1 px-2 py-1 text-xs sm:gap-2 sm:px-4 sm:py-2 sm:text-sm min-w-[36px]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isExporting ? "Exporting..." : "Export CSV"}
            </span>
          </Button>
          <select
            value={filters.planFilter}
            onChange={(e) => updateFilters({ planFilter: e.target.value })}
            className="px-2 py-1 border border-gray-300 rounded-md text-xs sm:px-3 sm:py-2 sm:text-sm min-w-[80px]"
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
            className="px-2 py-1 border border-gray-300 rounded-md text-xs sm:px-3 sm:py-2 sm:text-sm min-w-[80px]"
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
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm min-w-[36px] flex items-center"
          >
            <RefreshCw
              className={`h-4 w-4 mr-0 sm:mr-1 ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
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

      {/* NEW: Invite Business Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-600" />
              Invite Business to ConvoFlow
            </DialogTitle>
            <DialogDescription>
              Send an invitation email to a business to join our WhatsApp automation platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name *</Label>
                <Input
                  id="business-name"
                  value={inviteForm.name}
                  onChange={(e) => handleInviteFormChange('name', e.target.value)}
                  placeholder="Enter business name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Email Address *</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => handleInviteFormChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>
            </div>

            {/* Invitation Message */}
            <div className="space-y-2">
              <Label htmlFor="invitation-message">Invitation Message</Label>
              <Textarea
                id="invitation-message"
                value={inviteForm.description}
                onChange={(e) => handleInviteFormChange('description', e.target.value)}
                placeholder="Customize your invitation message..."
                className="min-h-[200px] resize-none"
                rows={8}
              />
              <p className="text-xs text-gray-500">
                Use <code>{'{{name}}'}</code> to personalize the message with the business name.
              </p>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Email Preview
              </h4>
              <div className="bg-white p-4 rounded border text-sm">
                <div className="font-semibold text-gray-900 mb-2">
                   Subject: Invitation to Join ConvoFlow - WhatsApp Automation Platform
                </div>
                <div className="whitespace-pre-wrap text-gray-700">
                  {inviteForm.description.replace(/\{\{name\}\}/g, inviteForm.name || '[Business Name]')}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInviteModal(false)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendInvite}
              disabled={isInviting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isInviting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invite
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminBusinesses;
