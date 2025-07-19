// Connection testing functionality and utilities

import { PhoneNumber, ConnectionTestResult } from "./mockdata";
import { useToast } from "@/hooks/use-toast";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Test WhatsApp Business API connection
 * @param phoneNumber - The phone number configuration to test
 * @returns Promise<ConnectionTestResult>
 */
export const testConnection = async (
  phoneNumber: PhoneNumber
): Promise<ConnectionTestResult> => {
  try {
    // Simulate connection testing delay
    await delay(3000);

    // Simulate different test scenarios
    const testScenarios = [
      {
        success: true,
        message: "Connection successful! All systems are working properly.",
        details: {
          businessAccountVerified: true,
          phoneNumberVerified: true,
          webhookVerified: true,
          accessTokenValid: true,
        },
      },
      {
        success: false,
        message: "Connection failed: Invalid access token.",
        details: {
          businessAccountVerified: true,
          phoneNumberVerified: true,
          webhookVerified: true,
          accessTokenValid: false,
        },
      },
      {
        success: false,
        message: "Connection failed: Webhook verification failed.",
        details: {
          businessAccountVerified: true,
          phoneNumberVerified: true,
          webhookVerified: false,
          accessTokenValid: true,
        },
      },
      {
        success: true,
        message:
          "Connection successful with warnings: Phone number not verified.",
        details: {
          businessAccountVerified: true,
          phoneNumberVerified: false,
          webhookVerified: true,
          accessTokenValid: true,
        },
      },
    ];

    // Randomly select a test scenario (in real implementation, this would be actual API calls)
    const randomScenario =
      testScenarios[Math.floor(Math.random() * testScenarios.length)];

    console.log(
      `Testing connection for phone number ${phoneNumber.id}:`,
      randomScenario
    );

    return randomScenario;
  } catch (error) {
    console.error("Error testing connection:", error);
    return {
      success: false,
      message: "Connection test failed due to network error.",
      details: {
        businessAccountVerified: false,
        phoneNumberVerified: false,
        webhookVerified: false,
        accessTokenValid: false,
      },
    };
  }
};

/**
 * Test webhook endpoint
 * @param webhookUrl - The webhook URL to test
 * @param verifyToken - The verify token
 * @returns Promise<boolean>
 */
export const testWebhook = async (
  webhookUrl: string,
  verifyToken: string
): Promise<boolean> => {
  try {
    await delay(1500);

    // TODO: Replace with actual webhook verification
    console.log(`Testing webhook: ${webhookUrl} with token: ${verifyToken}`);

    // Simulate webhook test (randomly succeed or fail)
    return Math.random() > 0.3;
  } catch (error) {
    console.error("Error testing webhook:", error);
    return false;
  }
};

/**
 * Validate access token
 * @param accessToken - The access token to validate
 * @param businessId - The business ID
 * @returns Promise<boolean>
 */
export const validateAccessToken = async (
  accessToken: string,
  businessId: string
): Promise<boolean> => {
  try {
    await delay(1000);

    // TODO: Replace with actual WhatsApp Business API call
    console.log(`Validating access token for business: ${businessId}`);

    // Simulate token validation (randomly succeed or fail)
    return Math.random() > 0.2;
  } catch (error) {
    console.error("Error validating access token:", error);
    return false;
  }
};

/**
 * Check phone number verification status
 * @param phoneNumberId - The phone number ID
 * @param accessToken - The access token
 * @returns Promise<boolean>
 */
export const checkPhoneNumberVerification = async (
  phoneNumberId: string,
  accessToken: string
): Promise<boolean> => {
  try {
    await delay(800);

    // TODO: Replace with actual WhatsApp Business API call
    console.log(
      `Checking verification status for phone number: ${phoneNumberId}`
    );

    // Simulate verification check (randomly succeed or fail)
    return Math.random() > 0.4;
  } catch (error) {
    console.error("Error checking phone number verification:", error);
    return false;
  }
};

/**
 * Custom hook for connection testing
 * @returns Object with connection testing functions
 */
export const useConnectionTest = () => {
  const { toast } = useToast();

  const handleTestConnection = async (phoneNumber: PhoneNumber) => {
    try {
      toast({
        title: "Testing Connection",
        description: "Testing connection to WhatsApp Business API...",
      });

      const result = await testConnection(phoneNumber);

      if (result.success) {
        toast({
          title: "Connection Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test connection. Please try again.",
        variant: "destructive",
      });
      return {
        success: false,
        message: "Connection test failed",
      };
    }
  };

  const handleTestWebhook = async (webhookUrl: string, verifyToken: string) => {
    try {
      toast({
        title: "Testing Webhook",
        description: "Verifying webhook endpoint...",
      });

      const isValid = await testWebhook(webhookUrl, verifyToken);

      if (isValid) {
        toast({
          title: "Webhook Valid",
          description: "Webhook endpoint is responding correctly.",
        });
      } else {
        toast({
          title: "Webhook Failed",
          description: "Webhook endpoint verification failed.",
          variant: "destructive",
        });
      }

      return isValid;
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test webhook. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleValidateToken = async (
    accessToken: string,
    businessId: string
  ) => {
    try {
      toast({
        title: "Validating Token",
        description: "Checking access token validity...",
      });

      const isValid = await validateAccessToken(accessToken, businessId);

      if (isValid) {
        toast({
          title: "Token Valid",
          description: "Access token is valid and active.",
        });
      } else {
        toast({
          title: "Token Invalid",
          description: "Access token is invalid or expired.",
          variant: "destructive",
        });
      }

      return isValid;
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate token. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleTestConnection,
    handleTestWebhook,
    handleValidateToken,
  };
};

/**
 * Get connection status badge color
 * @param status - The connection status
 * @returns string - CSS class for badge color
 */
export const getConnectionStatusColor = (
  status: PhoneNumber["status"]
): string => {
  switch (status) {
    case "Connected":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Error":
      return "bg-red-100 text-red-800";
    case "Disconnected":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Format last verified date
 * @param lastVerified - The last verified date string
 * @returns string - Formatted date or "Never"
 */
export const formatLastVerified = (lastVerified: string | null): string => {
  if (!lastVerified) return "Never";

  try {
    const date = new Date(lastVerified);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return lastVerified;
  }
};
