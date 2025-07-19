// API functions for phone number connection and management

import {
  PhoneNumber,
  NewPhoneNumberData,
  ConnectionTestResult,
} from "./mockdata";

export interface PhoneNumberResponse {
  success: boolean;
  message: string;
  data?: PhoneNumber;
}

export interface PhoneNumberActionResponse {
  success: boolean;
  message: string;
  phoneNumberId: number;
  action: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Add a new phone number connection
 * @param phoneNumberData - The phone number data to add
 * @returns Promise<PhoneNumberResponse>
 */
export const addPhoneNumber = async (
  phoneNumberData: NewPhoneNumberData
): Promise<PhoneNumberResponse> => {
  try {
    // Simulate API call delay
    await delay(2000);

    // Validate required fields
    if (
      !phoneNumberData.displayName ||
      !phoneNumberData.businessId ||
      !phoneNumberData.accessToken
    ) {
      return {
        success: false,
        message: "Please fill in all required fields",
      };
    }

    // Create new phone number object
    const newPhoneNumber: PhoneNumber = {
      id: Date.now(), // Simple ID generation for demo
      phoneNumber: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`, // Generate random phone number
      displayName: phoneNumberData.displayName,
      businessId: phoneNumberData.businessId,
      appId: phoneNumberData.appId,
      phoneNumberId: phoneNumberData.phoneNumberId,
      accessToken: phoneNumberData.accessToken,
      webhookUrl: phoneNumberData.webhookUrl,
      verifyToken: phoneNumberData.verifyToken,
      status: "Pending", // Start with pending status
      lastVerified: null,
      messagesSent: 0,
      messagesReceived: 0,
    };

    // TODO: Replace with actual API call to WhatsApp Business API
    console.log("Adding phone number:", newPhoneNumber);

    return {
      success: true,
      message:
        "Phone number added successfully. Connection test in progress...",
      data: newPhoneNumber,
    };
  } catch (error) {
    console.error("Error adding phone number:", error);
    return {
      success: false,
      message: "Failed to add phone number. Please try again.",
    };
  }
};

/**
 * Update phone number status
 * @param phoneNumberId - The ID of the phone number to update
 * @param status - The new status
 * @returns Promise<PhoneNumberResponse>
 */
export const updatePhoneNumberStatus = async (
  phoneNumberId: number,
  status: PhoneNumber["status"]
): Promise<PhoneNumberResponse> => {
  try {
    await delay(500);

    // TODO: Replace with actual API call
    console.log(`Updating phone number ${phoneNumberId} status to ${status}`);

    return {
      success: true,
      message: `Phone number status updated to ${status}`,
    };
  } catch (error) {
    console.error("Error updating phone number status:", error);
    return {
      success: false,
      message: "Failed to update phone number status. Please try again.",
    };
  }
};

/**
 * Delete a phone number
 * @param phoneNumberId - The ID of the phone number to delete
 * @returns Promise<PhoneNumberResponse>
 */
export const deletePhoneNumber = async (
  phoneNumberId: number
): Promise<PhoneNumberResponse> => {
  try {
    await delay(1000);

    // TODO: Replace with actual API call
    console.log(`Deleting phone number ${phoneNumberId}`);

    return {
      success: true,
      message: "Phone number removed successfully",
    };
  } catch (error) {
    console.error("Error deleting phone number:", error);
    return {
      success: false,
      message: "Failed to remove phone number. Please try again.",
    };
  }
};

/**
 * Get phone number configuration
 * @param phoneNumberId - The ID of the phone number
 * @returns Promise<any>
 */
export const getPhoneNumberConfig = async (
  phoneNumberId: number
): Promise<any> => {
  try {
    await delay(800);

    // TODO: Replace with actual API call
    console.log(`Fetching configuration for phone number ${phoneNumberId}`);

    // Mock configuration data
    return {
      success: true,
      data: {
        phoneNumberId,
        webhookEndpoints: [
          { url: "https://your-domain.com/webhook", verified: true },
          { url: "https://backup-domain.com/webhook", verified: false },
        ],
        messageTemplates: 5,
        businessVerification: "Verified",
        displayPhoneNumber: "+1234567890",
        qualityRating: "Green",
        messagingLimit: "1000/day",
      },
    };
  } catch (error) {
    console.error("Error fetching phone number configuration:", error);
    return {
      success: false,
      message: "Failed to fetch phone number configuration. Please try again.",
    };
  }
};

/**
 * Get webhook logs for a phone number
 * @param phoneNumberId - The ID of the phone number
 * @returns Promise<any>
 */
export const getWebhookLogs = async (phoneNumberId: number): Promise<any> => {
  try {
    await delay(1000);

    // TODO: Replace with actual API call
    console.log(`Fetching webhook logs for phone number ${phoneNumberId}`);

    // Mock webhook logs data
    const logs = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      method: "POST",
      status: Math.random() > 0.1 ? 200 : 500,
      responseTime: Math.floor(Math.random() * 1000) + 100,
      payload: {
        object: "whatsapp_business_account",
        entry: [
          {
            id: "BUSINESS_ID",
            changes: [
              {
                value: {
                  messaging_product: "whatsapp",
                  metadata: { phone_number_id: phoneNumberId },
                  messages: [
                    {
                      from: "+1234567890",
                      id: `msg_${i}`,
                      timestamp: Date.now() - i * 60000,
                      text: { body: `Test message ${i + 1}` },
                      type: "text",
                    },
                  ],
                },
                field: "messages",
              },
            ],
          },
        ],
      },
    }));

    return {
      success: true,
      data: {
        phoneNumberId,
        logs,
        totalLogs: 150,
        successRate: 95.2,
      },
    };
  } catch (error) {
    console.error("Error fetching webhook logs:", error);
    return {
      success: false,
      message: "Failed to fetch webhook logs. Please try again.",
    };
  }
};

/**
 * Refresh phone number data from WhatsApp API
 * @param phoneNumberId - The ID of the phone number
 * @returns Promise<PhoneNumberResponse>
 */
export const refreshPhoneNumberData = async (
  phoneNumberId: number
): Promise<PhoneNumberResponse> => {
  try {
    await delay(1500);

    // TODO: Replace with actual API call to WhatsApp Business API
    console.log(`Refreshing data for phone number ${phoneNumberId}`);

    return {
      success: true,
      message: "Phone number data refreshed successfully",
    };
  } catch (error) {
    console.error("Error refreshing phone number data:", error);
    return {
      success: false,
      message: "Failed to refresh phone number data. Please try again.",
    };
  }
};
