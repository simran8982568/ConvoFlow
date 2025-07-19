import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
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
import HeaderCard from "./headercard";

// Mock data
const mockTemplates = [
  {
    id: 1,
    name: "Welcome New Customer",
    businessName: "TechCorp Solutions",
    category: "Marketing",
    submissionDate: "2024-03-15",
    status: "Pending",
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
    status: "Pending",
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

  const filteredTemplates = mockTemplates.filter((template) => {
    return (
      filterStatus === "all" || template.status.toLowerCase() === filterStatus
    );
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

  const handleApprove = (templateId: number) => {
    console.log(`Approved template ${templateId} with comment: ${comment}`);
    // TODO: Send approval to backend
    setComment("");
  };

  const handleReject = (templateId: number) => {
    console.log(`Rejected template ${templateId} with comment: ${comment}`);
    // TODO: Send rejection to backend
    setComment("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Template Moderation
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve WhatsApp templates submitted by businesses
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                          <DialogDescription>
                            Template submitted by {template.businessName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Template Preview */}
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="space-y-3">
                                <div className="font-semibold text-gray-900 border-b pb-2">
                                  {template.content.header}
                                </div>
                                <div className="text-gray-700 leading-relaxed">
                                  {template.content.body}
                                </div>
                                <div className="text-xs text-gray-500 border-t pt-2">
                                  {template.content.footer}
                                </div>
                                {template.content.buttons && (
                                  <div className="flex gap-2 pt-2">
                                    {template.content.buttons.map(
                                      (button, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          className="text-xs"
                                        >
                                          {button}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Template Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Category
                              </label>
                              <div className="mt-1">
                                {getCategoryBadge(template.category)}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Current Status
                              </label>
                              <div className="mt-1">
                                {getStatusBadge(template.status)}
                              </div>
                            </div>
                          </div>

                          {template.rejectionReason && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="text-sm font-medium text-red-800">
                                Rejection Reason
                              </div>
                              <div className="text-sm text-red-700 mt-1">
                                {template.rejectionReason}
                              </div>
                            </div>
                          )}

                          {/* Comment Section */}
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Comment (Optional)
                            </label>
                            <Textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add a comment for the business owner..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          {template.status === "Pending" && (
                            <div className="flex gap-3 pt-4">
                              <Button
                                onClick={() => handleApprove(template.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Template
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(template.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Template
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminTemplates;
