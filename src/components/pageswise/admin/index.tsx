// Admin Module Exports
// This file provides clean exports for all Admin components

// Main Components - These are the primary page components
export { default as AdminDashboard } from "./dashboard/indexdashboard";
export { default as AdminTemplates } from "./templates/indextemplates";
export { default as AdminContacts } from "./contacts/indexcontacts";
export { default as AdminCampaigns } from "./campaigns/indexcampaigns";
export { default as AdminAutomation } from "./automation/indexautomation";
export { default as AdminBilling } from "./billing/indexbilling";
export { default as AdminInbox } from "./inbox/indexinbox";
export { default as AdminPhoneNumbers } from "./phonenumbers/indexphone";
export { default as AdminSettings } from "./settings/indexsettings";

// Dashboard Components
export { default as DashboardStatsCards } from "./dashboard/statscards";
export { default as DashboardEngagementChart } from "./dashboard/engagementchart";
export { default as DashboardRecentActivityCard } from "./dashboard/recentactivitycard";
export { default as DashboardErrorBoundary } from "./dashboard/errorboundary";

// Template Components
export { default as TemplateStatsCards } from "./templates/templatestatscards";
export { default as TemplateFilters } from "./templates/templatefilters";
export { default as TemplateGrid } from "./templates/templategrid";

// Data Hooks
// eslint-disable-next-line react-refresh/only-export-components
export { useDashboardData } from "./dashboard/dashboarddata";
// eslint-disable-next-line react-refresh/only-export-components
export { useTemplatesData } from "./templates/templatesdata";

// Types
export type {
  DashboardStats,
  EngagementData,
  ActivityItem,
} from "./dashboard/dashboarddata";
export type {
  Template,
  TemplateStats,
  TemplateFilters as TemplateFiltersType,
} from "./templates/templatesdata";

// Note: Other component exports are available directly from their respective folders
// For example: import { SomeComponent } from '@/pages/admin/contacts/somecomponent'
// This keeps the main index clean and prevents circular dependency issues
