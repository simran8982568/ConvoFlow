import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Import organized components
import {
  mockPhoneNumbers,
  NewPhoneNumberData,
  validatePhoneNumberData,
} from "./mockdata";
import { addPhoneNumber } from "./apiconnection";
import PhoneNumbersHeader from "./header";
import PhoneNumberStatsCards from "./cards";
import PhoneNumberList from "./phonenumberlist";
import AddPhoneNumberDialog from "./addphonedialog";

const AdminPhoneNumbers: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Form state for adding new phone number
  const [newPhoneNumber, setNewPhoneNumber] = useState<NewPhoneNumberData>({
    displayName: "",
    phoneNumber: "",
    businessId: "",
    phoneNumberId: "",
  });

  const handleAddPhoneNumber = async () => {
    setIsLoading(true);
    setErrors([]);

    // Validate form data
    const validation = validatePhoneNumberData(newPhoneNumber);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await addPhoneNumber(newPhoneNumber);

      if (result.success) {
        toast({
          title: "Phone Number Added",
          description: result.message,
        });
        setIsAddDialogOpen(false);
        setNewPhoneNumber({
          displayName: "",
          phoneNumber: "",
          businessId: "",
          phoneNumberId: "",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddDialogOpen(false);
    setErrors([]);
    setNewPhoneNumber({
      displayName: "",
      phoneNumber: "",
      businessId: "",
      phoneNumberId: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Add Phone Number Dialog */}
      <PhoneNumbersHeader
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      >
        <AddPhoneNumberDialog
          newPhoneNumber={newPhoneNumber}
          setNewPhoneNumber={setNewPhoneNumber}
          onAddPhoneNumber={handleAddPhoneNumber}
          onCancel={handleCancelAdd}
          isLoading={isLoading}
          errors={errors}
        />
      </PhoneNumbersHeader>

      {/* Stats Cards */}
      <PhoneNumberStatsCards phoneNumbers={mockPhoneNumbers} />

      {/* Phone Numbers List */}
      <PhoneNumberList phoneNumbers={mockPhoneNumbers} />
    </div>
  );
};

export default AdminPhoneNumbers;
