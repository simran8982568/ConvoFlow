// invoices.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { mockBillingData } from "./mockdata";

const getInvoiceStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
          Paid
        </span>
      );
    case "pending":
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Pending
        </span>
      );
    case "overdue":
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
          Overdue
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
          {status}
        </span>
      );
  }
};

const Invoices: React.FC = () => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Invoice
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockBillingData.invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{invoice.id}</td>
                  <td className="py-3 px-4">{invoice.date}</td>
                  <td className="py-3 px-4">${invoice.amount}</td>
                  <td className="py-3 px-4">
                    {getInvoiceStatusBadge(invoice.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Invoices;
