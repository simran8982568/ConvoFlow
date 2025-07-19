// header.tsx
import React from "react";

const ContactsHeader: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
      <p className="text-gray-600 mt-1">
        Manage your WhatsApp contacts and segments
      </p>
    </div>
  </div>
);

export default ContactsHeader;
