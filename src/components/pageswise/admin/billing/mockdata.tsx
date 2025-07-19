// mockdata.tsx
export const mockBillingData = {
  currentPlan: {
    name: "Pro",
    price: 29.99,
    billingCycle: "monthly",
    nextBillingDate: "2024-04-15",
    status: "active",
    features: [
      "Up to 5,000 messages per month",
      "20 automation workflows",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
  },
  usage: {
    messages: {
      used: 3250,
      total: 5000,
      percentage: 65,
    },
    automations: {
      used: 12,
      total: 20,
      percentage: 60,
    },
    contacts: {
      used: 2500,
      total: 10000,
      percentage: 25,
    },
  },
  paymentMethod: {
    type: "credit_card",
    last4: "4242",
    expiryDate: "05/25",
    name: "John Doe",
  },
  invoices: [
    {
      id: "INV-001",
      date: "2024-03-15",
      amount: 29.99,
      status: "paid",
      downloadUrl: "#",
    },
    {
      id: "INV-002",
      date: "2024-02-15",
      amount: 29.99,
      status: "paid",
      downloadUrl: "#",
    },
    {
      id: "INV-003",
      date: "2024-01-15",
      amount: 29.99,
      status: "paid",
      downloadUrl: "#",
    },
  ],
};

export const availablePlans = [
  {
    name: "Free",
    price: 0,
    billingCycle: "monthly",
    features: [
      "Up to 100 messages per month",
      "1 automation workflow",
      "Basic analytics",
      "Email support",
    ],
    recommended: false,
  },
  {
    name: "Starter",
    price: 9.99,
    billingCycle: "monthly",
    features: [
      "Up to 1,000 messages per month",
      "5 automation workflows",
      "Basic analytics",
      "Email support",
      "Template library access",
    ],
    recommended: false,
  },
  {
    name: "Pro",
    price: 29.99,
    billingCycle: "monthly",
    features: [
      "Up to 5,000 messages per month",
      "20 automation workflows",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: 99.99,
    billingCycle: "monthly",
    features: [
      "Up to 25,000 messages per month",
      "Unlimited automation workflows",
      "Advanced analytics with exports",
      "Dedicated support",
      "API access",
      "Custom integrations",
      "Multi-user access",
    ],
    recommended: false,
  },
];
