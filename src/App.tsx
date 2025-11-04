import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import ActiveJobFooter from "@/components/layout/ActiveJobFooter";
import { useAppDispatch } from "@/store";
import { setActiveJob, clearActiveJob } from "@/store";
import { authApi } from "@/lib/api/auth";
import { userJobsApi } from "@/lib/api/user";
import { contractorJobsApi } from "@/lib/api/contractor";
import ProtectedRoute, { RoleRoute } from "./components/auth/ProtectedRoute";
const Index = lazy(() => import("./pages/Index"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const ContractorDashboard = lazy(() => import("./pages/contractor/ContractorDashboard"));
const UserJobs = lazy(() => import("./pages/user/Jobs"));
const CreateJob = lazy(() => import("./pages/user/CreateJob"));
const Payments = lazy(() => import("./pages/user/Payments"));
const JobDetails = lazy(() => import("./pages/user/JobDetails"));
const UserProfile = lazy(() => import("./pages/user/Profile"));
const ContractorJobs = lazy(() => import("./pages/contractor/Jobs"));
const ContractorJobDetails = lazy(() => import("./pages/contractor/JobDetails"));
const MyJobs = lazy(() => import("./pages/contractor/MyJobs"));
const Workers = lazy(() => import("./pages/contractor/Workers"));
const Earnings = lazy(() => import("./pages/contractor/Earnings"));
const ContractorProfile = lazy(() => import("./pages/contractor/Profile"));
const RateCards = lazy(() => import("./pages/contractor/RateCards"));
const ContractorPayments = lazy(() => import("./pages/contractor/Payments"));
const UserNotifications = lazy(() => import("./pages/user/Notifications"));
const ContractorNotifications = lazy(() => import("./pages/contractor/Notifications"));
const Bank = lazy(() => import("./pages/contractor/Bank"));
const Payouts = lazy(() => import("./pages/contractor/Payouts"));
const Security = lazy(() => import("./pages/user/Security"));
const UserNotificationPreferences = lazy(() => import("./pages/user/NotificationPreferences"));
const ContractorNotificationPreferences = lazy(() => import("./pages/contractor/NotificationPreferences"));
const QuoteManage = lazy(() => import("./pages/contractor/QuoteManage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WorkerTrackJob = lazy(() => import('./pages/worker/TrackJob'));
const VerifyLocation = lazy(() => import('./pages/worker/VerifyLocation'));
const TrackWorkerPage = lazy(() => import('./pages/user/TrackWorker'));

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
          <Suspense fallback={<div>Loading...</div>}>
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
                path="/user/jobs/:jobId/track"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={["USER"]}>
                      <TrackWorkerPage />
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
                path="/contractor/jobs/:jobId"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={["CONTRACTOR"]}>
                      <ContractorJobDetails />
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
              <Route path="/worker/verify-location" element={<VerifyLocation />} />
              <Route path="/worker/track-job/:jobId" element={<WorkerTrackJob />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
