import React from "react";
import { Building2, MessageSquare, Send, Zap } from "lucide-react";
import StatsCard from "@/components/common/StatsCard";

const HeaderCard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatsCard
      title="Total Businesses"
      value="103"
      icon={Building2}
      trend={{ value: "15% growth this month", isPositive: true }}
      color="teal"
    />
    <StatsCard
      title="Messages Sent"
      value="267K"
      icon={MessageSquare}
      trend={{ value: "18% from last month", isPositive: true }}
      color="blue"
    />
    <StatsCard
      title="Campaigns Created"
      value="1,720"
      icon={Send}
      trend={{ value: "12% from last month", isPositive: true }}
      color="green"
    />
    <StatsCard
      title="Active Automations"
      value="2,456"
      icon={Zap}
      trend={{ value: "25% from last month", isPositive: true }}
      color="purple"
    />
  </div>
);

export default HeaderCard;
