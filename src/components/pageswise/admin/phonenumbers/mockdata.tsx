// Mock data for phone numbers and related interfaces

export interface PhoneNumber {
  id: number;
  phoneNumber: string;
  displayName: string;
  status: "Connected" | "Pending" | "Error" | "Disconnected";
  businessId: string;
  appId: string;
  phoneNumberId: string;
  accessToken: string;
  webhookUrl: string;
  verifyToken: string;
  lastVerified: string | null;
  messagesSent: number;
  messagesReceived: number;
}

export interface NewPhoneNumberData {
  displayName: string;
  phoneNumber?: string;
  businessId: string;
  phoneNumberId: string;
  appId?: string;
  accessToken?: string;
  webhookUrl?: string;
  verifyToken?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    businessAccountVerified: boolean;
    phoneNumberVerified: boolean;
    webhookVerified: boolean;
    accessTokenValid: boolean;
  };
}

export interface PhoneNumberStats {
  totalNumbers: number;
  connectedNumbers: number;
  totalMessagesSent: number;
  totalMessagesReceived: number;
}

export const mockPhoneNumbers: PhoneNumber[] = [
  {
    id: 1,
    phoneNumber: "+1234567890",
    displayName: "Main Business Line",
    status: "Connected",
    businessId: "BUSINESS_ID_123",
    appId: "APP_ID_456",
    phoneNumberId: "PHONE_ID_789",
    accessToken: "EAABwzLixnjYBO...",
    webhookUrl: "https://your-domain.com/webhook",
    verifyToken: "your_verify_token_123",
    lastVerified: "2024-03-15 10:30 AM",
    messagesSent: 1250,
    messagesReceived: 890,
  },
  {
    id: 2,
    phoneNumber: "+1234567891",
    displayName: "Support Line",
    status: "Pending",
    businessId: "BUSINESS_ID_456",
    appId: "APP_ID_789",
    phoneNumberId: "PHONE_ID_012",
    accessToken: "EAABwzLixnjYBO...",
    webhookUrl: "https://your-domain.com/webhook",
    verifyToken: "your_verify_token_456",
    lastVerified: null,
    messagesSent: 0,
    messagesReceived: 0,
  },
  {
    id: 3,
    phoneNumber: "+1234567892",
    displayName: "Marketing Line",
    status: "Error",
    businessId: "BUSINESS_ID_789",
    appId: "APP_ID_012",
    phoneNumberId: "PHONE_ID_345",
    accessToken: "EAABwzLixnjYBO...",
    webhookUrl: "https://your-domain.com/webhook",
    verifyToken: "your_verify_token_789",
    lastVerified: "2024-03-10 02:15 PM",
    messagesSent: 567,
    messagesReceived: 234,
  },
];

// Utility functions for phone number data
export const getPhoneNumberStats = (
  phoneNumbers: PhoneNumber[]
): PhoneNumberStats => {
  return {
    totalNumbers: phoneNumbers.length,
    connectedNumbers: phoneNumbers.filter((p) => p.status === "Connected")
      .length,
    totalMessagesSent: phoneNumbers.reduce((sum, p) => sum + p.messagesSent, 0),
    totalMessagesReceived: phoneNumbers.reduce(
      (sum, p) => sum + p.messagesReceived,
      0
    ),
  };
};

export const getPhoneNumberById = (
  phoneNumbers: PhoneNumber[],
  id: number
): PhoneNumber | undefined => {
  return phoneNumbers.find((p) => p.id === id);
};

export const maskToken = (token: string): string => {
  if (token.length <= 8) return token;
  return token.substring(0, 8) + "...";
};

export const validatePhoneNumberData = (
  data: NewPhoneNumberData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.displayName.trim()) {
    errors.push("Display name is required");
  }

  if (!data.businessId.trim()) {
    errors.push("Business ID is required");
  }

  if (!data.appId.trim()) {
    errors.push("App ID is required");
  }

  if (!data.phoneNumberId.trim()) {
    errors.push("Phone Number ID is required");
  }

  if (!data.accessToken.trim()) {
    errors.push("Access Token is required");
  }

  if (!data.webhookUrl.trim()) {
    errors.push("Webhook URL is required");
  } else if (!isValidUrl(data.webhookUrl)) {
    errors.push("Webhook URL must be a valid HTTPS URL");
  }

  if (!data.verifyToken.trim()) {
    errors.push("Verify Token is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "https:";
  } catch {
    return false;
  }
};
