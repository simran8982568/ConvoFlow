import React, { useState } from "react";
import { Building2, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Business } from "../../../../api/apicall/superadmin/businesses/businessapi";

/**
 * Props for HeaderCard component
 */
interface HeaderCardProps {
  filteredBusinesses: Business[];
  getPlanBadge: (plan: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  setSelectedBusiness: (business: Business) => void;
  updateBusinessStatus?: (
    businessId: number,
    status: "Active" | "Inactive"
  ) => Promise<boolean>;
  deleteBusiness?: (businessId: number) => Promise<boolean>;
}

/**
 * Table component for displaying filtered businesses and details dialog
 */
const HeaderCard: React.FC<HeaderCardProps> = ({
  filteredBusinesses,
  getPlanBadge,
  getStatusBadge,
  setSelectedBusiness,
  updateBusinessStatus,
  deleteBusiness,
}) => {
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleStatusToggle = async (business: Business) => {
    if (!updateBusinessStatus) return;

    setActionLoading(business.id);
    const newStatus = business.status === "Active" ? "Inactive" : "Active";
    await updateBusinessStatus(business.id, newStatus);
    setActionLoading(null);
  };

  const handleDelete = async (businessId: number) => {
    if (!deleteBusiness) return;

    if (
      window.confirm(
        "Are you sure you want to delete this business? This action cannot be undone."
      )
    ) {
      setActionLoading(businessId);
      await deleteBusiness(businessId);
      setActionLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Business Directory
        </CardTitle>
        <CardDescription>
          Complete list of businesses registered on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Campaigns</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.map((business) => (
              <TableRow
                key={business.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">{business.name}</TableCell>
                <TableCell>{getPlanBadge(business.plan)}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(business.signupDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{business.campaigns}</TableCell>
                <TableCell>{business.messages.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(business.status)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBusiness(business)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{business.name}</DialogTitle>
                        <DialogDescription>
                          Business insights and usage statistics
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Current Plan
                            </div>
                            <div className="font-semibold">{business.plan}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Status</div>
                            <div className="font-semibold">
                              {business.status}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600">
                              Automations
                            </div>
                            <div className="font-semibold text-blue-700">
                              {business.automations}
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-600">
                              Top Category
                            </div>
                            <div className="font-semibold text-green-700">
                              {business.topCategory}
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-teal-50 rounded-lg">
                          <div className="text-sm text-teal-600">
                            Usage This Month
                          </div>
                          <div className="font-semibold text-teal-700">
                            {business.usage}%
                          </div>
                          <div className="w-full bg-teal-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${business.usage}%` }}
                            />
                          </div>
                        </div>
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
  );
};

export default HeaderCard;
