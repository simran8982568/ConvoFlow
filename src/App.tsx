import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import SuperAdminLayout from "@/layouts/SuperAdminLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import LoginForm from "@/components/auth/LoginForm";
import AdminDashboard from "@/components/pageswise/admin/dashboard/indexdashboard";
import AdminTemplates from "@/components/pageswise/admin/templates/indextemplates";
import AdminContacts from "@/components/pageswise/admin/contacts/indexcontacts";
import AdminCampaigns from "@/components/pageswise/admin/campaigns/indexcampaigns";
import AdminInbox from "@/components/pageswise/admin/inbox/indexinbox";
import AdminAutomation from "@/components/pageswise/admin/automation/indexautomation";
import AdminPhoneNumbers from "@/components/pageswise/admin/phonenumbers/indexphone";
import AdminSettings from "@/components/pageswise/admin/settings/indexsettings";
import AdminBilling from "@/components/pageswise/admin/billing/indexbilling";
import AdminAnalytics from "@/components/pageswise/admin/analytics/indexanalytics";
import SuperAdminDashboard from "@/components/pageswise/superadmin/dashboard/indexdashboard";
import SuperAdminBusinesses from "@/components/pageswise/superadmin/businesses/indexbusinesses";
import SuperAdminTemplates from "@/components/pageswise/superadmin/templates/indextemplates";
import SuperAdminAnalytics from "@/components/pageswise/superadmin/analytics/indexanalytics";
import SuperAdminPlans from "@/components/pageswise/superadmin/plans/indexplans";
import SuperAdminLogs from "@/components/pageswise/superadmin/logs/indexlogs";
import SuperAdminSettings from "@/components/pageswise/superadmin/settings/indexsettings";
import NavigationTest from "@/components/common/NavigationTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginForm role="admin" />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout children={""} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inbox" element={<AdminInbox />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="automation" element={<AdminAutomation />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="phone-numbers" element={<AdminPhoneNumbers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Super Admin Routes */}
          <Route
            path="/superadmin/login"
            element={<LoginForm role="superadmin" />}
          />
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdminLayout children={""} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="businesses" element={<SuperAdminBusinesses />} />
            <Route path="templates" element={<SuperAdminTemplates />} />
            <Route path="analytics" element={<SuperAdminAnalytics />} />
            <Route path="plans" element={<SuperAdminPlans />} />
            <Route path="logs" element={<SuperAdminLogs />} />
            <Route path="settings" element={<SuperAdminSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Navigation Test Route */}
          <Route path="/test" element={<NavigationTest />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
