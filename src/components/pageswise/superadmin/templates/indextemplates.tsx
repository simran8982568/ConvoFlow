import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Search,
  Download,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import admin template components for inherited functionality
import WhatsAppPreviewModal from "../../admin/templates/WhatsAppPreviewModal";
import HeaderCard from "./headercard";
import SuperAdminCreateTemplateModal from "./SuperAdminCreateTemplateModal";
import TemplateErrorBoundary from "./TemplateErrorBoundary";

// Mock data - Combined SuperAdmin and Admin templates
const mockSuperAdminTemplates = [
  {
    id: 1,
    name: "Welcome New Customer",
    businessName: "TechCorp Solutions",
    category: "Marketing",
    submittedAt: "2024-03-15",
    status: "Approved", // Auto-approved for SuperAdmin
    createdBy: "SuperAdmin",
    creatorType: "superadmin",
    content: {
      header: "Welcome to TechCorp! 🎉",
      body: "Hi {{1}}, thank you for choosing our services. We are excited to help you grow your business with our innovative solutions.",
      footer: "TechCorp Solutions - Your Growth Partner",
      buttons: ["Get Started", "Learn More"],
    },
  },
  {
    id: 2,
    name: "Order Confirmation",
    businessName: "Global Retail Co",
    category: "Transactional",
    submittedAt: "2024-03-14",
    status: "Approved",
    createdBy: "SuperAdmin",
    creatorType: "superadmin",
    content: {
      header: "Order Confirmed ✅",
      body: "Your order #{{1}} has been confirmed and will be delivered by {{2}}. Track your order using the link below.",
      footer: "Global Retail - Happy Shopping",
      buttons: ["Track Order", "Contact Support"],
    },
  },
  {
    id: 3,
    name: "Payment Reminder",
    businessName: "Digital Marketing Pro",
    category: "Utility",
    submittedAt: "2024-03-13",
    status: "Rejected",
    createdBy: "SuperAdmin",
    creatorType: "superadmin",
    content: {
      header: "⚠️ Payment Due",
      body: "Dear {{1}}, your payment of ₹{{2}} is due on {{3}}. Please make the payment to avoid service interruption.",
      footer: "Digital Marketing Pro",
      buttons: ["Pay Now", "Contact Us"],
    },
    rejectionReason: "Template content too aggressive for payment reminders",
  },
  {
    id: 4,
    name: "Appointment Booking",
    businessName: "StartupXYZ",
    category: "Utility",
    submittedAt: "2024-03-12",
    status: "Approved", // Auto-approved for SuperAdmin
    createdBy: "SuperAdmin",
    creatorType: "superadmin",
    content: {
      header: "📅 Appointment Scheduled",
      body: "Hi {{1}}, your appointment is scheduled for {{2}} at {{3}}. Please arrive 10 minutes early.",
      footer: "StartupXYZ Services",
      buttons: ["Confirm", "Reschedule"],
    },
  },
];

// Mock data for Admin-created templates
const mockAdminTemplates = [
  {
    id: 101,
    name: "Order Confirmation",
    businessName: "E-commerce Store",
    category: "Transactional",
    status: "Approved",
    submittedAt: "2024-07-19",
    createdBy: "Admin",
    creatorType: "admin",
    content: {
      header: "✅ Order Confirmed",
      body: "Thank you {{1}}! Your order #{{2}} has been confirmed and will be delivered by {{3}}.",
      footer: "E-commerce Store",
      buttons: ["Track Order", "Contact Support"],
    },
  },
  {
    id: 102,
    name: "Payment Reminder",
    businessName: "Financial Services",
    category: "Utility",
    status: "Pending",
    submittedAt: "2024-07-18",
    createdBy: "Admin",
    creatorType: "admin",
    content: {
      header: "💳 Payment Due",
      body: "Hi {{1}}, your payment of ${{2}} is due on {{3}}. Please make the payment to avoid late fees.",
      footer: "Financial Services",
      buttons: ["Pay Now", "View Details"],
    },
  },
  {
    id: 103,
    name: "Welcome Message",
    businessName: "Tech Solutions Inc.",
    category: "Marketing",
    status: "Approved",
    submittedAt: "2024-07-17",
    createdBy: "Admin",
    creatorType: "admin",
    content: {
      header: "🎉 Welcome!",
      body: "Welcome to {{1}}, {{2}}! We're excited to have you on board. Get started with our platform today.",
      footer: "Tech Solutions Inc.",
      buttons: ["Get Started", "Learn More"],
    },
  },
];

// Combine all templates
const allTemplates = [...mockSuperAdminTemplates, ...mockAdminTemplates];

const SuperAdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [comment, setComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState(allTemplates);
  const [creatorFilter, setCreatorFilter] = useState("all"); // New filter for creator type
  const [isSlidePreviewOpen, setIsSlidePreviewOpen] = useState(false); // Side-slide preview

  // Admin template functionality states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { toast } = useToast();

  const filteredTemplates = templates.filter((template) => {
    // Ensure template has required properties
    if (!template || !template.name || !template.status) {
      return false;
    }

    const matchesStatus = filterStatus === "all" ||
      (template.status && template.status.toLowerCase() === filterStatus);

    const matchesCreator = creatorFilter === "all" ||
      (creatorFilter === "superadmin" && template.creatorType === "superadmin") ||
      (creatorFilter === "admin" && template.creatorType === "admin");

    const matchesSearch = searchTerm === "" ||
      (template.name && template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.businessName && template.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.category && template.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.createdBy && template.createdBy.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesCreator && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
    };
    const icons = {
      Pending: Clock,
      Approved: CheckCircle,
      Rejected: XCircle,
    };
    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge
        variant="secondary"
        className={colors[status as keyof typeof colors]}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      Marketing: "bg-blue-100 text-blue-700",
      Transactional: "bg-purple-100 text-purple-700",
      Utility: "bg-teal-100 text-teal-700",
    };
    return (
      <Badge
        variant="secondary"
        className={
          colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
        }
      >
        {category}
      </Badge>
    );
  };

  // Admin template functionality handlers
  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  // SuperAdmin specific handlers
  const handleApprove = (templateId: number) => {
    toast({
      title: "Template Approved",
      description: "Template has been approved and is now available for use.",
    });
    setComment("");
  };

  const handleReject = (templateId: number) => {
    toast({
      title: "Template Rejected",
      description: "Template has been rejected and the business has been notified.",
      variant: "destructive",
    });
    setComment("");
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const tableElement = document.getElementById('templates-table');
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

        pdf.save('superadmin-templates.pdf');

        toast({
          title: "Export Successful",
          description: "Templates table has been exported to PDF successfully.",
        });
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export templates table. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleTemplateCreated = (newTemplate: any) => {
    // Add the new template to the list
    setTemplates(prev => [newTemplate, ...prev]);

    toast({
      title: "Template Created",
      description: `Template "${newTemplate.name}" has been created and is now available to all admins.`,
    });
  };

  // Handle row click for side-slide preview
  const handleRowClick = (template: any) => {
    setSelectedTemplate(template);
    setIsSlidePreviewOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Template Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, review and approve WhatsApp templates for businesses
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Template
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <select
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Creators</option>
            <option value="superadmin">SuperAdmin</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      <HeaderCard mockTemplates={allTemplates} />

      {/* Templates Table */}
      <TemplateErrorBoundary>
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Template Queue
          </CardTitle>
          <CardDescription>
            Review templates for WhatsApp Business API compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="templates-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredTemplates && filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TableRow
                    key={template.id || `template-${Math.random()}`}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(template)}
                  >
                    <TableCell className="font-medium">
                      {template.name || 'Unnamed Template'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {template.businessName || 'Unknown Business'}
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(template.category || 'Other')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {template.createdBy || 'Unknown'}
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            template.creatorType === 'superadmin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        >
                          {template.creatorType === 'superadmin' ? 'SuperAdmin' : 'Admin'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(template.status || 'Pending')}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {template.submittedAt || 'Unknown Date'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            setSelectedTemplate(template);
                            setIsPreviewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No templates found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
        </Card>
      </TemplateErrorBoundary>

      {/* WhatsApp Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              WhatsApp-style preview of the template
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <WhatsAppPreviewModal
              template={selectedTemplate}
              onClose={() => setIsPreviewModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Modal - Using SuperAdmin Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new WhatsApp template that will be available to all admins.
            </DialogDescription>
          </DialogHeader>

          <SuperAdminCreateTemplateModal
            onClose={() => setShowCreateModal(false)}
            onTemplateCreated={handleTemplateCreated}
          />
        </DialogContent>
      </Dialog>

      {/* Side-Slide Preview Panel */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isSlidePreviewOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Template Preview</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSlidePreviewOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedTemplate && (
              <div className="space-y-4">
                {/* Template Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTemplate.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 font-medium">{selectedTemplate.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-1">{getStatusBadge(selectedTemplate.status)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created by:</span>
                      <span className="ml-1 font-medium">{selectedTemplate.createdBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-1">{selectedTemplate.submittedAt}</span>
                    </div>
                  </div>

                  {/* URL if available */}
                  {selectedTemplate.content?.url && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-gray-500 text-sm">Reference URL:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={selectedTemplate.content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate flex-1"
                        >
                          {selectedTemplate.content.url}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(selectedTemplate.content.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Preview */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <TemplateErrorBoundary fallback={
                    <div className="p-4 text-center text-gray-500">
                      <p>Unable to load template preview</p>
                    </div>
                  }>
                    <WhatsAppPreviewModal
                      template={selectedTemplate}
                      onClose={() => {}} // Empty function since we handle close differently
                    />
                  </TemplateErrorBoundary>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for side-slide */}
      {isSlidePreviewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSlidePreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default SuperAdminTemplates;
