import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeaderCardProps {
  mockTemplates: Array<{
    id: number;
    name: string;
    businessName: string;
    category: string;
    submissionDate: string;
    status: string;
    content: {
      header: string;
      body: string;
      footer: string;
      buttons: string[];
    };
    rejectionReason?: string;
  }>;
}

/**
 * Stats grid for template moderation dashboard
 */
const HeaderCard: React.FC<HeaderCardProps> = ({ mockTemplates }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
          Total Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          {mockTemplates.length}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-yellow-600">
          Pending Review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
          {mockTemplates.filter((t) => t.status === "Pending").length}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-green-600">
          Approved
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
          {mockTemplates.filter((t) => t.status === "Approved").length}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-red-600">
          Rejected
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
          {mockTemplates.filter((t) => t.status === "Rejected").length}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default HeaderCard;
