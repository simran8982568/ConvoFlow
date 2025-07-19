// headercards.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, BarChart3, Settings } from "lucide-react";
import type { Workflow } from "./types";

interface HeaderCardsProps {
  workflows: Workflow[];
}

const HeaderCards: React.FC<HeaderCardsProps> = ({ workflows }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Workflows
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.length}
              </p>
            </div>
            <Zap className="h-8 w-8 text-teal-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Workflows
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.filter((w) => w.status === "Active").length}
              </p>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Runs</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows
                  .reduce((sum, w) => sum + w.totalRuns, 0)
                  .toLocaleString()}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg. Completion
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  workflows.reduce((sum, w) => sum + w.completionRate, 0) /
                    workflows.length
                )}
                %
              </p>
            </div>
            <Settings className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderCards;
