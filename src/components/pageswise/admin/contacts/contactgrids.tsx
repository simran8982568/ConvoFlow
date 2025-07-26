// contactgrids.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockContacts } from "./mockdata";

const getStatusBadge = (status: string) => {
  return status === "Active" ? (
    <Badge className="bg-green-100 text-green-800">Active</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  );
};

const ContactGrids: React.FC<{ filteredContacts: typeof mockContacts }> = ({
  filteredContacts,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const contactsToShow = showAll
    ? filteredContacts
    : filteredContacts.slice(0, 6);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactsToShow.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  {contact.company && (
                    <CardDescription className="mt-1">
                      {contact.company}
                    </CardDescription>
                  )}
                </div>
                {getStatusBadge(contact.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">{contact.phone}</p>
                {contact.email && (
                  <p className="text-sm text-gray-600">{contact.email}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                Last activity: {contact.lastActivity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredContacts.length > 6 && !showAll && (
        <div className="flex justify-center py-4">
          <button
            className="px-4 py-2 text-xs md:text-sm rounded-full border border-teal-200 text-teal-700 bg-white hover:bg-teal-50 shadow-sm w-full sm:w-auto"
            onClick={() => setShowAll(true)}
          >
            View All Contacts
          </button>
        </div>
      )}
      {filteredContacts.length > 6 && showAll && (
        <div className="flex justify-center py-4">
          <button
            className="px-4 py-2 text-xs md:text-sm rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </>
  );
};

export default ContactGrids;
