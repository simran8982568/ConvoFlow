import React from "react";
import { Trash2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DangerZoneProps {
  onResetApiKeys: () => void;
  onDeleteAccount: () => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({
  onResetApiKeys,
  onDeleteAccount,
}) => {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={onResetApiKeys}
        >
          <Key className="w-4 h-4 mr-2" />
          Reset API Keys
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={onDeleteAccount}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
