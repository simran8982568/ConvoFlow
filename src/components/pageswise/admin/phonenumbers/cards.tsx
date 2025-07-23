// Stats cards component for phone number metrics

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneNumber, getPhoneNumberStats } from "./mockdata";

interface PhoneNumberStatsCardsProps {
  phoneNumbers: PhoneNumber[];
}

const PhoneNumberStatsCards: React.FC<PhoneNumberStatsCardsProps> = ({
  phoneNumbers,
}) => {
  const stats = getPhoneNumberStats(phoneNumbers);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Phone Numbers Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Numbers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalNumbers}
              </p>
            </div>
            <div className="text-3xl">📞</div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Numbers Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.connectedNumbers}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Sent Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMessagesSent.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">✈️</div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Received Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Messages Received
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMessagesReceived.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneNumberStatsCards;
