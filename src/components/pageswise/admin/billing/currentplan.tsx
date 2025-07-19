// currentplan.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, ChevronDown, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockBillingData } from "./mockdata";

const CurrentPlan: React.FC = () => {
  const [showPlans, setShowPlans] = useState(false);
  const { toast } = useToast();

  const handleChangePlan = (planName: string) => {
    toast({
      title: "Plan Change Requested",
      description: `Your request to change to the ${planName} plan has been submitted.`,
    });
    setShowPlans(false);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="inline-block">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </span>
          Current Plan
        </CardTitle>
        <CardDescription>
          Your current subscription details and usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {mockBillingData.currentPlan.name} Plan
            </h3>
            <p className="text-gray-600">
              ${mockBillingData.currentPlan.price}/
              {mockBillingData.currentPlan.billingCycle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">Active</Badge>
            <Button variant="outline" onClick={() => setShowPlans(!showPlans)}>
              Change Plan
              {showPlans ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Next billing date: {mockBillingData.currentPlan.nextBillingDate}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Plan Features</h4>
              <ul className="space-y-1">
                {mockBillingData.currentPlan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Current Usage</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Messages</span>
                    <span>
                      {mockBillingData.usage.messages.used} /{" "}
                      {mockBillingData.usage.messages.total}
                    </span>
                  </div>
                  <Progress
                    value={mockBillingData.usage.messages.percentage}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Automations</span>
                    <span>
                      {mockBillingData.usage.automations.used} /{" "}
                      {mockBillingData.usage.automations.total}
                    </span>
                  </div>
                  <Progress
                    value={mockBillingData.usage.automations.percentage}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Contacts</span>
                    <span>
                      {mockBillingData.usage.contacts.used} /{" "}
                      {mockBillingData.usage.contacts.total}
                    </span>
                  </div>
                  <Progress
                    value={mockBillingData.usage.contacts.percentage}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlan;
