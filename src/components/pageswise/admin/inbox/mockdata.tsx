export const mockConversations = [
  {
    id: 1,
    contact: {
      name: "John Doe",
      phone: "+1234567890",
      avatar: null,
      status: "online",
    },
    lastMessage: "Thank you for the quick response!",
    timestamp: "2 min ago",
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: "contact",
        content: "Hi, I have a question about my recent order",
        timestamp: "10:30 AM",
        status: "delivered",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Hello! I'd be happy to help you with your order. Can you please provide your order number?",
        timestamp: "10:32 AM",
        status: "read",
      },
      {
        id: 3,
        sender: "contact",
        content: "Sure, it's #ORD-12345",
        timestamp: "10:33 AM",
        status: "delivered",
      },
      {
        id: 4,
        sender: "agent",
        content:
          "Perfect! I can see your order here. It was shipped yesterday and should arrive by tomorrow. Here's your tracking link: track.example.com/12345",
        timestamp: "10:35 AM",
        status: "read",
      },
      {
        id: 5,
        sender: "contact",
        content: "Thank you for the quick response!",
        timestamp: "10:36 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: 2,
    contact: {
      name: "Jane Smith",
      phone: "+1234567891",
      avatar: null,
      status: "offline",
    },
    lastMessage: "When will the sale start?",
    timestamp: "15 min ago",
    unreadCount: 2,
    messages: [
      {
        id: 1,
        sender: "contact",
        content: "Hi! I saw your announcement about the upcoming sale.",
        timestamp: "9:45 AM",
        status: "delivered",
      },
      {
        id: 2,
        sender: "contact",
        content: "When will the sale start?",
        timestamp: "9:46 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: 3,
    contact: {
      name: "Mike Johnson",
      phone: "+1234567892",
      avatar: null,
      status: "online",
    },
    lastMessage: "Great, thanks!",
    timestamp: "1 hour ago",
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: "contact",
        content: "Is my appointment confirmed for tomorrow?",
        timestamp: "8:30 AM",
        status: "delivered",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Yes, your appointment is confirmed for tomorrow at 2:00 PM. We'll send you a reminder 1 hour before.",
        timestamp: "8:32 AM",
        status: "read",
      },
      {
        id: 3,
        sender: "contact",
        content: "Great, thanks!",
        timestamp: "8:33 AM",
        status: "delivered",
      },
    ],
  },
];

export const quickReplies = [
  "Thank you for contacting us!",
  "I'll look into this for you.",
  "Is there anything else I can help you with?",
  "Your order has been processed.",
  "We appreciate your business!",
];
