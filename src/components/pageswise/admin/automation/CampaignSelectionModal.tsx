import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Send, CheckCircle } from 'lucide-react';
import { mockCampaigns } from '../campaigns/mockdata';

interface CampaignSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCampaign: (campaign: any) => void;
}

const CampaignSelectionModal: React.FC<CampaignSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCampaign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const filteredCampaigns = mockCampaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.template.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
  };

  const handleConfirmSelection = () => {
    if (selectedCampaign) {
      onSelectCampaign(selectedCampaign);
      onClose();
      setSelectedCampaign(null);
      setSearchTerm('');
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedCampaign(null);
    setSearchTerm('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'Scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      case 'Paused':
        return <Badge className="bg-gray-100 text-gray-800">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Campaign</DialogTitle>
          <DialogDescription>
            Choose a campaign to include in your automation workflow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Campaign List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCampaign?.id === campaign.id
                    ? 'ring-2 ring-teal-500 bg-teal-50'
                    : ''
                }`}
                onClick={() => handleSelectCampaign(campaign)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Send className="w-4 h-4 text-teal-600" />
                        {campaign.name}
                        {selectedCampaign?.id === campaign.id && (
                          <CheckCircle className="w-4 h-4 text-teal-600" />
                        )}
                      </CardTitle>
                      <div className="mt-1 text-sm text-gray-600">
                        Template: {campaign.template} • Audience: {campaign.audience}
                      </div>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {campaign.sent.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Sent</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-teal-600">
                        {campaign.delivered.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Delivered</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {Math.round((campaign.opened / campaign.delivered) * 100)}%
                      </p>
                      <p className="text-xs text-gray-600">Open Rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {Math.round((campaign.clicked / campaign.opened) * 100)}%
                      </p>
                      <p className="text-xs text-gray-600">Click Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedCampaign}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Select Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignSelectionModal;
