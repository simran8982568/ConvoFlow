import React from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResetApiKeysProps {
  onResetApiKeys: () => void;
}

const ResetApiKeys: React.FC<ResetApiKeysProps> = ({
  onResetApiKeys,
}) => {
  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <Key className="h-5 w-5" />
          Reset API Keys
        </CardTitle>
        <CardDescription>Reset your API keys for enhanced security</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
          onClick={onResetApiKeys}
        >
          <Key className="w-4 h-4 mr-2" />
          Reset API Keys
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResetApiKeys;
