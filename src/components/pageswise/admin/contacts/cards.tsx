// cards.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Tag, FileText } from "lucide-react";
import { mockContacts } from "./mockdata";

const Cards: React.FC<{ filteredCount: number }> = ({ filteredCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Contacts</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockContacts.length}
            </p>
          </div>
          <Users className="h-8 w-8 text-teal-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Contacts</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockContacts.filter((c) => c.status === "Active").length}
            </p>
          </div>
          <UserPlus className="h-8 w-8 text-green-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">VIP Contacts</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockContacts.filter((c) => c.tags.includes("VIP")).length}
            </p>
          </div>
          <Tag className="h-8 w-8 text-purple-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Filtered</p>
            <p className="text-2xl font-bold text-gray-900">{filteredCount}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Cards;
