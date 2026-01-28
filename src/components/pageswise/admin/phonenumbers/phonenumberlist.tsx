// Phone number list component to display phone number cards

import React, { useState } from "react";
import {
  Phone,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneNumber, maskToken } from "./mockdata";
import { getConnectionStatusColor, formatLastVerified } from "./connectiontest";
import PhoneNumberActionButtons from "./actionbuttons";
import { useToast } from "@/hooks/use-toast";

interface PhoneNumberListProps {
  phoneNumbers: PhoneNumber[];
  onRefresh?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewConfig?: (id: number) => void;
  onViewLogs?: (id: number) => void;
}

const PhoneNumberList: React.FC<PhoneNumberListProps> = ({
  phoneNumbers,
  onRefresh,
  onDelete,
  onViewConfig,
  onViewLogs,
}) => {
  const { toast } = useToast();
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    });
  };

  const getStatusIcon = (status: PhoneNumber["status"]) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "Disconnected":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (phoneNumbers.length === 0) {
    return (
      <div className="text-center py-12">
        <Phone className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No phone numbers
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first WhatsApp Business phone number.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {phoneNumbers.map((phoneNumber) => {
          const isExpanded = expandedCardId === phoneNumber.id;
          return (
            <Card
              key={phoneNumber.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="w-4 h-4 text-teal-600" />
                      {phoneNumber.displayName}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <span>{phoneNumber.phoneNumber}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          copyToClipboard(phoneNumber.phoneNumber, "Phone number")
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getConnectionStatusColor(phoneNumber.status)}>
                      {getStatusIcon(phoneNumber.status)}
                      <span className="ml-1">{phoneNumber.status}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="block lg:hidden p-0"
                      onClick={() =>
                        setExpandedCardId((prev) =>
                          prev === phoneNumber.id ? null : phoneNumber.id
                        )
                      }
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className={`transition-all duration-300 ease-in-out overflow-hidden lg:block ${
                  isExpanded ? "block" : "hidden"
                }`}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Business ID</p>
                      <div className="flex items-center gap-1">
                        <p className="text-gray-600 font-mono text-xs">
                          {maskToken(phoneNumber.businessId)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            copyToClipboard(phoneNumber.businessId, "Business ID")
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Phone Number ID</p>
                      <div className="flex items-center gap-1">
                        <p className="text-gray-600 font-mono text-xs">
                          {maskToken(phoneNumber.phoneNumberId)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            copyToClipboard(
                              phoneNumber.phoneNumberId,
                              "Phone Number ID"
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {phoneNumber.messagesSent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Sent</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {phoneNumber.messagesReceived.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Received</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <span>
                      Last verified: {formatLastVerified(phoneNumber.lastVerified)}
                    </span>
                  </div>

                  <PhoneNumberActionButtons
                    phoneNumber={phoneNumber}
                    onRefresh={onRefresh}
                    onDelete={onDelete}
                    onViewConfig={onViewConfig}
                    onViewLogs={onViewLogs}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ✅ View All Button (mobile only & more than 6 cards) */}
      {phoneNumbers.length > 6 && (
        <div className="mt-4 flex justify-center lg:hidden">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      )}
    </>
  );
};

export default PhoneNumberList;
