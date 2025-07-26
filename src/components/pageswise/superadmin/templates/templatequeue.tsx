import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, User, UserCheck } from 'lucide-react';

// Mock data for template queue
const mockQueueData = [
  {
    id: 1,
    name: "Welcome Message",
    businessName: "Tech Solutions Inc.",
    category: "Marketing",
    status: "Pending",
    submittedAt: "2024-07-20",
    createdBy: "Admin",
    creatorType: "admin"
  },
  {
    id: 2,
    name: "Order Confirmation",
    businessName: "E-commerce Store",
    category: "Transactional",
    status: "Approved",
    submittedAt: "2024-07-19",
    createdBy: "John Doe",
    creatorType: "user"
  },
  {
    id: 3,
    name: "Appointment Reminder",
    businessName: "Healthcare Clinic",
    category: "Utility",
    status: "Pending",
    submittedAt: "2024-07-18",
    createdBy: "Admin",
    creatorType: "admin"
  },
  {
    id: 4,
    name: "Payment Reminder",
    businessName: "Financial Services",
    category: "Transactional",
    status: "Rejected",
    submittedAt: "2024-07-17",
    createdBy: "Jane Smith",
    creatorType: "user"
  },
  {
    id: 5,
    name: "Product Launch",
    businessName: "Startup XYZ",
    category: "Marketing",
    status: "Approved",
    submittedAt: "2024-07-16",
    createdBy: "Admin",
    creatorType: "admin"
  },
  {
    id: 6,
    name: "Support Ticket",
    businessName: "Tech Support Co.",
    category: "Utility",
    status: "Pending",
    submittedAt: "2024-07-15",
    createdBy: "Mike Johnson",
    creatorType: "user"
  }
];

const TemplateQueue = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter data based on creator type
  const filteredData = mockQueueData.filter(template => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'admin') return template.creatorType === 'admin';
    if (activeFilter === 'user') return template.creatorType === 'user';
    return true;
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
      <Badge variant="secondary" className={colors[status as keyof typeof colors]}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getCreatorBadge = (creatorType: string) => {
    if (creatorType === 'admin') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <UserCheck className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <User className="h-3 w-3 mr-1" />
          User
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Template Queue</CardTitle>
            <p className="text-gray-600 mt-1">Review and manage template submissions</p>
          </div>

          {/* Toggle buttons similar to Revenue page */}
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="px-3 py-1 text-sm"
            >
              All Templates
            </Button>
            <Button
              variant={activeFilter === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('admin')}
              className="px-3 py-1 text-sm"
            >
              Created by Admin
            </Button>
            <Button
              variant={activeFilter === 'user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('user')}
              className="px-3 py-1 text-sm"
            >
              Created by User
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((template) => (
                <TableRow key={template.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.businessName}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{template.createdBy}</span>
                      {getCreatorBadge(template.creatorType)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
                  <TableCell>{template.submittedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No templates found for the selected filter.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateQueue;