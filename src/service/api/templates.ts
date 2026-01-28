// Mock template data service
export interface Template {
  id: string;
  name: string;
  category: string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  components: {
    type: string;
    text: string;
  }[];
}

// Mock templates data
const mockTemplates: Template[] = [
  {
    id: "template_1",
    name: "Welcome Message",
    category: "MARKETING",
    language: "en",
    status: "APPROVED",
    components: [
      {
        type: "BODY",
        text: "Hi {{1}}, welcome to our service! How can we help you today?",
      },
    ],
  },
  {
    id: "template_2",
    name: "Order Confirmation",
    category: "UTILITY",
    language: "en",
    status: "APPROVED",
    components: [
      {
        type: "BODY",
        text: "Your order #{{1}} has been confirmed! Estimated delivery: {{2}}",
      },
    ],
  },
  {
    id: "template_3",
    name: "Appointment Reminder",
    category: "UTILITY",
    language: "en",
    status: "APPROVED",
    components: [
      {
        type: "BODY",
        text: "Reminder: Your appointment with {{1}} is scheduled for {{2}} at {{3}}",
      },
    ],
  },
  {
    id: "template_4",
    name: "Feedback Request",
    category: "MARKETING",
    language: "en",
    status: "APPROVED",
    components: [
      {
        type: "BODY",
        text: "How was your experience with us? Please rate our service from 1-5 stars.",
      },
    ],
  },
];

// Mock API functions
export const fetchTemplates = async (): Promise<Template[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockTemplates;
};

export const syncTemplates = async (): Promise<Template[]> => {
  // Simulate API delay for sync
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockTemplates;
};
