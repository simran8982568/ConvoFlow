// availableplans.tsx
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
import { CheckCircle } from "lucide-react";
import { mockBillingData, availablePlans } from "./mockdata";

const AvailablePlans: React.FC = () => {
  return (
    <div className="mt-4 border rounded-lg p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Available Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {availablePlans.map((plan) => (
          <Card
            key={plan.name}
            className={`border ${
              plan.recommended ? "border-teal-500" : "border-gray-200"
            }`}
          >
            <CardHeader className="pb-2">
              {plan.recommended && (
                <Badge className="bg-teal-100 text-teal-800 self-start mb-1">
                  Recommended
                </Badge>
              )}
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>
                ${plan.price}/{plan.billingCycle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-1 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={
                  plan.name === mockBillingData.currentPlan.name
                    ? "outline"
                    : "default"
                }
                className={`w-full ${
                  plan.name === mockBillingData.currentPlan.name
                    ? ""
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
                disabled={plan.name === mockBillingData.currentPlan.name}
                size="sm"
              >
                {plan.name === mockBillingData.currentPlan.name
                  ? "Current Plan"
                  : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailablePlans;
