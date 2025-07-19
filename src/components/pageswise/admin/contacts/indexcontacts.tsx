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
import Cards from "./cards";
import Filters from "./filters";
import ContactGrids from "./contactgrids";

const AdminContacts: React.FC = () => {
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

  const filteredContacts = mockContacts.filter((contact) => {
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
    toast({
      title: "Contact Added",
      description: "New contact has been added successfully.",
    });
    setIsAddDialogOpen(false);
    setNewContact({ name: "", phone: "", email: "", company: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <ContactsHeader />
      <div className="flex gap-2 mb-4">
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new contact to your WhatsApp list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
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
                <Label htmlFor="company">Company</Label>
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
