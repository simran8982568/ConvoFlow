import React from "react";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PlanDistributionProps {
  mockPlanData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const PlanDistribution: React.FC<PlanDistributionProps> = ({
  mockPlanData,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Plan Distribution
      </CardTitle>
      <CardDescription>
        Breakdown of businesses by subscription plan
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockPlanData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {mockPlanData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {mockPlanData.map((plan) => (
          <div key={plan.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: plan.color }}
            />
            <span className="text-sm text-gray-600">
              {plan.name}: {plan.value} businesses
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default PlanDistribution;
