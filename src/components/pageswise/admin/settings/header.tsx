import React from "react";

interface SettingsHeaderProps {
  title?: string;
  description?: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title = "Settings",
  description = "Manage your account and business preferences",
}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default SettingsHeader;
