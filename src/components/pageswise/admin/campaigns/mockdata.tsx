// Mock data for campaigns, templates, and audiences

export interface Campaign {
  id: number;
  name: string;
  template: string;
  audience: string;
  status: "Active" | "Completed" | "Scheduled" | "Paused";
  scheduled: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  createdAt: string;
  type: "Automated" | "Broadcast";
}

export interface Template {
  id: number;
  name: string;
  category: string;
}

export interface Audience {
  id: number;
  name: string;
  count: number;
}

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Welcome Series",
    template: "Welcome New Customer",
    audience: "New Customers",
    status: "Active",
    scheduled: "2024-03-15 09:00",
    sent: 1250,
    delivered: 1180,
    opened: 890,
    clicked: 234,
    createdAt: "2024-03-14",
    type: "Automated",
  },
  {
    id: 2,
    name: "Product Launch",
    template: "Product Announcement",
    audience: "All Customers",
    status: "Completed",
    scheduled: "2024-03-10 10:00",
    sent: 2100,
    delivered: 2050,
    opened: 1680,
    clicked: 420,
    createdAt: "2024-03-09",
    type: "Broadcast",
  },
  {
    id: 3,
    name: "Holiday Sale",
    template: "Black Friday Sale",
    audience: "VIP Customers",
    status: "Scheduled",
    scheduled: "2024-03-20 08:00",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    createdAt: "2024-03-16",
    type: "Broadcast",
  },
  {
    id: 4,
    name: "Cart Abandonment",
    template: "Cart Reminder",
    audience: "Abandoned Carts",
    status: "Paused",
    scheduled: "2024-03-12 14:00",
    sent: 156,
    delivered: 149,
    opened: 98,
    clicked: 23,
    createdAt: "2024-03-11",
    type: "Automated",
  },
];

export const mockTemplates: Template[] = [
  { id: 1, name: "Welcome New Customer", category: "Marketing" },
  { id: 2, name: "Product Announcement", category: "Marketing" },
  { id: 3, name: "Black Friday Sale", category: "Marketing" },
  { id: 4, name: "Cart Reminder", category: "Utility" },
  { id: 5, name: "Order Confirmation", category: "Transactional" },
];

export const mockAudiences: Audience[] = [
  { id: 1, name: "All Customers", count: 2500 },
  { id: 2, name: "New Customers", count: 450 },
  { id: 3, name: "VIP Customers", count: 180 },
  { id: 4, name: "Abandoned Carts", count: 320 },
  { id: 5, name: "Inactive Users", count: 890 },
];
