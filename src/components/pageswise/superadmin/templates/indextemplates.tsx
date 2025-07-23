import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Search,
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

// Mock data - SuperAdmin templates are auto-approved
const mockTemplates = [
  {
    id: 1,
    name: "Welcome New Customer",
    businessName: "TechCorp Solutions",
    category: "Marketing",
    submissionDate: "2024-03-15",
    status: "Approved", // Auto-approved for SuperAdmin
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
    submissionDate: "2024-03-14",
    status: "Approved",
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
    submissionDate: "2024-03-13",
    status: "Rejected",
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
    submissionDate: "2024-03-12",
    status: "Approved", // Auto-approved for SuperAdmin
    content: {
      header: "📅 Appointment Scheduled",
      body: "Hi {{1}}, your appointment is scheduled for {{2}} at {{3}}. Please arrive 10 minutes early.",
      footer: "StartupXYZ Services",
      buttons: ["Confirm", "Reschedule"],
    },
  },
];

const SuperAdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [comment, setComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Admin template functionality states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { toast } = useToast();

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesStatus = filterStatus === "all" || template.status.toLowerCase() === filterStatus;
    const matchesSearch = searchTerm === "" ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
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
        <div className="flex items-center gap-3">
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
      <HeaderCard mockTemplates={mockTemplates} />

      {/* Templates Table */}
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
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow
                  key={template.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {template.businessName}
                  </TableCell>
                  <TableCell>{getCategoryBadge(template.category)}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(template.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default SuperAdminTemplates;
