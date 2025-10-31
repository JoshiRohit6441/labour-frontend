import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ActiveJobFooter from "@/components/layout/ActiveJobFooter";
import { useAppDispatch } from "@/store";
import { setActiveJob, clearActiveJob } from "@/store";
import { authApi } from "@/lib/api/auth";
import { userJobsApi } from "@/lib/api/user";
import { contractorJobsApi } from "@/lib/api/contractor";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import UserDashboard from "./pages/user/UserDashboard";
import ContractorDashboard from "./pages/contractor/ContractorDashboard";
import { ProtectedRoute, RoleRoute } from "@/components/auth/ProtectedRoute";
import UserJobs from "./pages/user/Jobs";
import CreateJob from "./pages/user/CreateJob";
import Payments from "./pages/user/Payments";
import JobDetails from "./pages/user/JobDetails";
import UserProfile from "./pages/user/Profile";
import ContractorJobs from "./pages/contractor/Jobs";
import MyJobs from "./pages/contractor/MyJobs";
import Workers from "./pages/contractor/Workers";
import Earnings from "./pages/contractor/Earnings";
import ContractorProfile from "./pages/contractor/Profile";
import RateCards from "./pages/contractor/RateCards";
import ContractorPayments from "./pages/contractor/Payments";
import UserNotifications from "./pages/user/Notifications";
import ContractorNotifications from "./pages/contractor/Notifications";
import Bank from "./pages/contractor/Bank";
import Payouts from "./pages/contractor/Payouts";
import Security from "./pages/user/Security";
import UserNotificationPreferences from "./pages/user/NotificationPreferences";
import ContractorNotificationPreferences from "./pages/contractor/NotificationPreferences";
import QuoteManage from "./pages/contractor/QuoteManage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hydrate = async () => {
      const user = authApi.getCurrentUser();
      if (!user) return;
      try {
        const res = user.role === 'CONTRACTOR' ? await contractorJobsApi.active() : await userJobsApi.active();
        const job = (res as any)?.data?.job || (res as any)?.job || null;
        if (job) dispatch(setActiveJob(job)); else dispatch(clearActiveJob());
      } catch {
        dispatch(clearActiveJob());
      }
    };
    hydrate();
  }, [dispatch]);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ActiveJobFooter />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <UserDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <UserJobs />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/create"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <CreateJob />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/payments"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <Payments />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/:jobId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <JobDetails />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <UserProfile />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/security"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <Security />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <UserNotifications />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/notification-preferences"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <UserNotificationPreferences />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <ContractorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/jobs"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <ContractorJobs />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/my-jobs"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <MyJobs />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/workers"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <Workers />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/earnings"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <Earnings />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/profile"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <ContractorProfile />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/notifications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <ContractorNotifications />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/notification-preferences"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <ContractorNotificationPreferences />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/quotes/manage"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <QuoteManage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/bank"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <Bank />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/payouts"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <Payouts />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/rate-cards"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <RateCards />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/payments"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONTRACTOR"]}>
                  <ContractorPayments />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
