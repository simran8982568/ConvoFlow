import React, { useState } from "react";
import { Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mockContacts, availableTags } from "./mockdata";
import ContactsHeader from "./header";
import ContactsImportExport from "./ContactsImportExport";
import Cards from "./cards";
import Filters from "./filters";
import ContactGrids from "./contactgrids";

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
  });

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === "all" || contact.tags.includes(filterTag);
    const matchesStatus =
      filterStatus === "all" || contact.status === filterStatus;
    return matchesSearch && matchesTag && matchesStatus;
  });

  const handleAddContact = () => {
    // Validate required fields
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name and Phone).",
        variant: "destructive",
      });
      return;
    }

    // Create new contact object
    const newContactObj = {
      id: Date.now(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
      email: newContact.email.trim() || "",
      company: newContact.company.trim() || "",
      status: "Active",
      tags: [],
      lastActivity: new Date().toISOString().split("T")[0],
    };

    // Add to contacts list (in a real app, this would be an API call)
    setContacts((prev) => [...prev, newContactObj]);

    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added successfully.`,
    });
    setIsAddDialogOpen(false);
    setNewContact({ name: "", phone: "", email: "", company: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <ContactsHeader />

      <div className="flex gap-2 mb-4">
        <ContactsImportExport />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm">
              <Plus className="w-3 h-3 mr-1" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new contact to your WhatsApp list. Fields marked with *
                are required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">
                  Email Address{" "}
                  <span className="text-sm text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="company">
                  Company{" "}
                  <span className="text-sm text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) =>
                    setNewContact({ ...newContact, company: e.target.value })
                  }
                  placeholder="Company name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddContact}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Add Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Cards filteredCount={filteredContacts.length} />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <ContactGrids filteredContacts={filteredContacts} />
    </div>
  );
};

export default AdminContacts;
