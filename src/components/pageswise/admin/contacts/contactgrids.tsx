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
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const contactsToShow = showAll
    ? filteredContacts
    : filteredContacts.slice(0, 6);

  // Helper: is mobile screen
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <>
      {/* Main grid for cards (hidden if mobile and expanded) */}
      <div
        className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${
          isMobile && expandedId ? "hidden" : ""
        }`}
      >
        {contactsToShow.map((contact) => {
          // Compact card for mobile
          const compact = isMobile && expandedId !== contact.id;
          return (
            <Card
              key={contact.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                compact ? "py-2 px-3" : ""
              }`}
              onClick={() => {
                if (isMobile)
                  setExpandedId(expandedId === contact.id ? null : contact.id);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 ">
                    <CardTitle className="text-base md:text-lg">
                      {contact.name}
                    </CardTitle>
                  </div>
                  {getStatusBadge(contact.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-2">
                  <p className="text-xs md:text-sm text-gray-600">
                    {contact.phone}
                  </p>
                </div>
                {/* Only show full info if not compact (desktop or expanded on mobile) */}
                {!compact && (
                  <>
                    {contact.company && (
                      <CardDescription className="mt-1 text-xs md:text-sm">
                        {contact.company}
                      </CardDescription>
                    )}
                    {contact.email && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {contact.email}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {contact.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last activity: {contact.lastActivity}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile full-screen expanded card overlay */}
      {isMobile && expandedId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[95vw] max-w-sm mx-auto p-4 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={() => setExpandedId(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {(() => {
              const contact = contactsToShow.find((c) => c.id === expandedId);
              if (!contact) return null;
              return (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      {contact.company && (
                        <CardDescription className="mt-1 text-sm">
                          {contact.company}
                        </CardDescription>
                      )}
                    </div>
                    {getStatusBadge(contact.status)}
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-sm text-gray-600 mt-1">
                        {contact.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Last activity: {contact.lastActivity}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

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
