// Mock data for WhatsApp templates - easily removable when connecting to Meta API
export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  components: TemplateComponent[];
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  buttons?: TemplateButton[];
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
}

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  url?: string;
  phone_number?: string;
}

export const dummyTemplates: WhatsAppTemplate[] = [
  {
    id: 'template-1',
    name: 'welcome_message',
    language: 'en',
    category: 'MARKETING',
    status: 'APPROVED',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Welcome to {{1}}!',
        example: {
          header_text: ['Urban Studioz'],
        },
      },
      {
        type: 'BODY',
        text: 'Hi {{1}}, thank you for reaching out! We are excited to help you with {{2}}. Reply with any questions.',
        example: {
          body_text: [['John', 'your order']],
        },
      },
      {
        type: 'FOOTER',
        text: 'Powered by AyuChat',
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'QUICK_REPLY', text: 'Get Started' },
          { type: 'QUICK_REPLY', text: 'Contact Support' },
        ],
      },
    ],
  },
  {
    id: 'template-2',
    name: 'order_confirmation',
    language: 'en',
    category: 'UTILITY',
    status: 'APPROVED',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Order Confirmed! 🎉',
      },
      {
        type: 'BODY',
        text: 'Your order #{{1}} has been confirmed. Expected delivery: {{2}}. Track your order using the link below.',
        example: {
          body_text: [['12345', 'Jan 25, 2024']],
        },
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'Track Order', url: 'https://example.com/track/{{1}}' },
          { type: 'PHONE_NUMBER', text: 'Call Support', phone_number: '+1234567890' },
        ],
      },
    ],
  },
  {
    id: 'template-3',
    name: 'appointment_reminder',
    language: 'en',
    category: 'UTILITY',
    status: 'APPROVED',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Appointment Reminder',
      },
      {
        type: 'BODY',
        text: 'Hi {{1}}, this is a reminder for your appointment on {{2}} at {{3}}. Please confirm your attendance.',
        example: {
          body_text: [['Sarah', 'January 20, 2024', '2:00 PM']],
        },
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'QUICK_REPLY', text: 'Confirm' },
          { type: 'QUICK_REPLY', text: 'Reschedule' },
          { type: 'QUICK_REPLY', text: 'Cancel' },
        ],
      },
    ],
  },
  {
    id: 'template-4',
    name: 'promotional_offer',
    language: 'en',
    category: 'MARKETING',
    status: 'APPROVED',
    components: [
      {
        type: 'HEADER',
        format: 'IMAGE',
        text: 'Special Offer Just for You!',
      },
      {
        type: 'BODY',
        text: 'Get {{1}}% off on your next purchase! Use code: {{2}}. Offer valid until {{3}}.',
        example: {
          body_text: [['25', 'SAVE25', 'January 31, 2024']],
        },
      },
      {
        type: 'FOOTER',
        text: 'Terms and conditions apply',
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'Shop Now', url: 'https://example.com/shop' },
        ],
      },
    ],
  },
  {
    id: 'template-5',
    name: 'otp_verification',
    language: 'en',
    category: 'AUTHENTICATION',
    status: 'APPROVED',
    components: [
      {
        type: 'BODY',
        text: 'Your verification code is: {{1}}. This code will expire in 10 minutes. Do not share this code with anyone.',
        example: {
          body_text: [['123456']],
        },
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'Copy Code', url: 'https://example.com/verify/{{1}}' },
        ],
      },
    ],
  },
];

// Helper function to get template by ID
export const getTemplateById = (id: string): WhatsAppTemplate | undefined => {
  return dummyTemplates.find((template) => template.id === id);
};

// Helper function to get templates by category
export const getTemplatesByCategory = (category: WhatsAppTemplate['category']): WhatsAppTemplate[] => {
  return dummyTemplates.filter((template) => template.category === category);
};