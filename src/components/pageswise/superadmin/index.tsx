// SuperAdmin Module Exports
// This file provides clean exports for all SuperAdmin components

// Main Components
export { default as SuperAdminDashboard } from './dashboard/indexdashboard';
export { default as SuperAdminBusinesses } from './businesses/indexbusinesses';
export { default as SuperAdminTemplates } from './templates/indextemplates';
export { default as SuperAdminAnalytics } from './analytics/indexanalytics';
export { default as SuperAdminPlans } from './plans/indexplans';
export { default as SuperAdminSettings } from './settings/indexsettings';
export { default as SuperAdminLogs } from './logs/indexlogs';
export { default as IndexAdmin } from './admin/indexadmin';

// Dashboard Components
export { default as DashboardHeaderCard } from './dashboard/headercard';
export { default as PlatformGrowth } from './dashboard/platformgrowth';
export { default as PlanDistribution } from './dashboard/plandistribution';
export { default as RecentActivity } from './dashboard/recentactivity';

// Business Components
export { default as BusinessHeaderCard } from './businesses/headercard';
export { default as BusinessDirectory } from './businesses/businessdirectory';

// Template Components
export { default as TemplateHeaderCard } from './templates/headercard';
export { default as TemplateQueue } from './templates/templatequeue';

// Analytics Components
export { default as AnalyticsHeaderCard } from './analytics/headercard';
export { default as MessageVolumeChart } from './analytics/messagevolumechart';
export { default as TopTemplatesChart } from './analytics/toptemplateschart';
export { default as BusinessGrowthChart } from './analytics/businessgrowthchart';
export { default as IndustryDistributionChart } from './analytics/industrydistributionchart';

// Plans Components
export { default as PlansHeaderCard } from './plans/headercard';
export { default as PlanCard } from './plans/plancard';
export { default as PlanDialog } from './plans/plandialog';

// Settings Components
export { default as PlatformBrandingCard } from './settings/platformbrandingcard';
export { default as SystemConfigurationCard } from './settings/systemconfigurationcard';
export { default as NotificationSettingsCard } from './settings/notificationsettingscard';
export { default as SecuritySettingsCard } from './settings/securitysettingscard';

// Logs Components
export { default as LogsStatsCard } from './logs/logsstatscard';
export { default as LogsFilterBar } from './logs/logsfilterbar';
export { default as LogsTable } from './logs/logstable';

// Admin Components
export { default as AdminPlatformGrowthChart } from './admin/platformgrowthchart';
export { default as AdminPlanDistributionChart } from './admin/plandistributionchart';
export { default as AdminRecentActivityCard } from './admin/recentactivitycard';

// Data Hooks
export { useAnalyticsData } from './analytics/analyticsdata';
export { usePlansData } from './plans/plansdata';
export { useSettingsData } from './settings/settingsdata';
export { useLogsData } from './logs/logsdata';
export { useAdminData } from './admin/admindata';

// Types
export type { Plan, PlanFormData } from './plans/plansdata';
export type { LogEntry, LogsFilters } from './logs/logsdata';
export type { 
  PlatformBrandingData, 
  SystemConfigurationData, 
  NotificationSettings 
} from './settings/settingsdata';
export type { 
  GrowthData, 
  PlanData, 
  ActivityItem 
} from './admin/admindata';
