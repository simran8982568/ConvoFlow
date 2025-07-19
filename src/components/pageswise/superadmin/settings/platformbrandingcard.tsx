import React from 'react';
import { Globe, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PlatformBrandingData {
  platformName: string;
  supportEmail: string;
  logo: File | null;
  welcomeMessage: string;
}

interface PlatformBrandingCardProps {
  data: PlatformBrandingData;
  onUpdate: (field: string, value: any) => void;
  loading?: boolean;
  error?: string | null;
}

const PlatformBrandingCard: React.FC<PlatformBrandingCardProps> = ({
  data,
  onUpdate,
  loading = false,
  error
}) => {
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdate('logo', file);
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Globe className="h-5 w-5" />
            Platform Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading branding settings</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Platform Branding
          </CardTitle>
          <CardDescription>
            Configure your platform's identity and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Platform Branding
        </CardTitle>
        <CardDescription>
          Configure your platform's identity and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="platformName">Platform Name</Label>
          <Input
            id="platformName"
            value={data.platformName}
            onChange={(e) => onUpdate('platformName', e.target.value)}
            placeholder="AyuChat"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="supportEmail">Support Email</Label>
          <Input
            id="supportEmail"
            type="email"
            value={data.supportEmail}
            onChange={(e) => onUpdate('supportEmail', e.target.value)}
            placeholder="support@ayuchat.com"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="logo">Platform Logo</Label>
          <div className="mt-1">
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={loading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('logo')?.click()}
              className="w-full"
              disabled={loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {data.logo ? data.logo.name : 'Upload Logo'}
            </Button>
          </div>
          {data.logo && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
              Selected: {data.logo.name}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Textarea
            id="welcomeMessage"
            value={data.welcomeMessage}
            onChange={(e) => onUpdate('welcomeMessage', e.target.value)}
            placeholder="Welcome message for new users..."
            rows={3}
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformBrandingCard;
