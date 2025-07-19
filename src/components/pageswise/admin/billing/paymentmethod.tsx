// paymentmethod.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { mockBillingData } from "./mockdata";

const PaymentMethod: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>Manage your payment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="font-medium">
                •••• {mockBillingData.paymentMethod.last4}
              </span>
            </div>
            <Badge variant="outline">Default</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Expires {mockBillingData.paymentMethod.expiryDate}
          </p>
          <p className="text-sm text-gray-600">
            {mockBillingData.paymentMethod.name}
          </p>
        </div>
        <Button variant="outline" className="w-full">
          Update Payment Method
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
