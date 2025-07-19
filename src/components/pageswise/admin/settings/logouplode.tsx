import React from "react";
import { Upload, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LogoUploadProps {
  logo: File | null;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ logo, onLogoUpload }) => {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={logo ? URL.createObjectURL(logo) : undefined} />
        <AvatarFallback>
          <Building className="w-8 h-8" />
        </AvatarFallback>
      </Avatar>
      <div>
        <Label htmlFor="logo-upload" className="cursor-pointer">
          <Button variant="outline" size="sm" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
            </span>
          </Button>
        </Label>
        <Input
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={onLogoUpload}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB</p>
      </div>
    </div>
  );
};

export default LogoUpload;
