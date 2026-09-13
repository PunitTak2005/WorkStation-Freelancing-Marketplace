import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Assuming MainLayout, DashboardLayout, ProtectedRoute exist
const MainLayout = lazy(() => import('@/components/layout/MainLayout'));
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const ProtectedRoute = lazy(() => import('@/components/protected/ProtectedRoute'));

// Lazy load all pages
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));

// Job pages
const JobBoardPage = lazy(() => import('@/features/jobs/pages/JobBoardPage'));
const JobDetailsPage = lazy(() => import('@/features/jobs/pages/JobDetailsPage'));
const SubmitProposalPage = lazy(() => import('@/features/proposals/pages/SubmitProposalPage'));
const CreateJobPage = lazy(() => import('@/features/jobs/pages/CreateJobPage'));
const MyJobsPage = lazy(() => import('@/features/jobs/pages/MyJobsPage'));

// Freelancer pages
const BrowseFreelancersPage = lazy(() => import('@/features/freelancers/pages/BrowseFreelancersPage'));
const FreelancerProfilePage = lazy(() => import('@/features/freelancers/pages/FreelancerProfilePage'));

// Dashboard pages
const ClientDashboard = lazy(() => import('@/features/dashboard/pages/ClientDashboard'));
const FreelancerDashboard = lazy(() => import('@/features/dashboard/pages/FreelancerDashboard'));
const AdminDashboard = lazy(() => import('@/features/dashboard/pages/AdminDashboard'));

// Other pages
const MyProposalsPage = lazy(() => import('@/features/proposals/pages/MyProposalsPage'));
const ViewProposalsPage = lazy(() => import('@/features/proposals/pages/ViewProposalsPage'));
const ContractsPage = lazy(() => import('@/features/contracts/pages/ContractsPage'));
const ContractDetailsPage = lazy(() => import('@/features/contracts/pages/ContractDetailsPage'));
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'));
const PaymentHistoryPage = lazy(() => import('@/features/payments/pages/PaymentHistoryPage'));
const PaymentSuccessPage = lazy(() => import('@/features/payments/pages/PaymentSuccessPage'));
const PaymentFailedPage = lazy(() => import('@/features/payments/pages/PaymentFailedPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const EditProfilePage = lazy(() => import('@/features/profile/pages/EditProfilePage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const AdminJobsPage = lazy(() => import('@/features/admin/pages/AdminJobsPage'));
const AdminReportsPage = lazy(() => import('@/features/admin/pages/AdminReportsPage'));
const AdminPaymentsPage = lazy(() => import('@/features/admin/pages/AdminPaymentsPage'));

// Static & Resource Pages
const ContactPage = lazy(() => import('@/features/static/ContactPage'));
const AboutPage = lazy(() => import('@/features/static/StaticPages').then(m => ({ default: m.AboutPage })));
const PrivacyPolicyPage = lazy(() => import('@/features/static/StaticPages').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('@/features/static/StaticPages').then(m => ({ default: m.TermsPage })));
const HelpCenterPage = lazy(() => import('@/features/static/StaticPages').then(m => ({ default: m.HelpCenterPage })));
const FaqPage = lazy(() => import('@/features/static/StaticPages').then(m => ({ default: m.FaqPage })));
import ScrollToTop from '@/components/common/ScrollToTop';

import { useAuth } from '@/hooks/useAuth';

const DashboardIndex = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (user?.role === 'client') return <Navigate to="/dashboard/client" replace />;
  return <Navigate to="/dashboard/freelancer" replace />;
};

// Error pages
const NotFoundPage = lazy(() => import('@/features/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/features/errors/UnauthorizedPage'));

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
        <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="jobs" element={<JobBoardPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path="jobs/:id/apply" element={<SubmitProposalPage />} />
          <Route path="projects" element={<JobBoardPage />} />
          <Route path="projects/:id" element={<JobDetailsPage />} />
          <Route path="projects/:id/apply" element={<SubmitProposalPage />} />
          <Route path="freelancers" element={<BrowseFreelancersPage />} />
          <Route path="freelancers/:id" element={<FreelancerProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="payments/success" element={<PaymentSuccessPage />} />
          <Route path="payments/failed" element={<PaymentFailedPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="help" element={<HelpCenterPage />} />
          <Route path="faq" element={<FaqPage />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardIndex />} />
            {/* Common */}
            <Route path="messages" element={<ChatPage />} />
            <Route path="messages/:conversationId" element={<ChatPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="contracts/:id" element={<ContractDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="payments" element={<PaymentHistoryPage />} />
            <Route path="payments/success" element={<PaymentSuccessPage />} />
            <Route path="payments/failed" element={<PaymentFailedPage />} />

            {/* Client & Admin */}
            <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} />}>
              <Route path="client" element={<ClientDashboard />} />
              <Route path="post-job" element={<CreateJobPage />} />
              <Route path="my-jobs" element={<MyJobsPage />} />
              <Route path="projects" element={<MyJobsPage />} />
              <Route path="my-jobs/:jobId/proposals" element={<ViewProposalsPage />} />
              <Route path="projects/:jobId/proposals" element={<ViewProposalsPage />} />
            </Route>

            {/* Freelancer Only */}
            <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
              <Route path="freelancer" element={<FreelancerDashboard />} />
              <Route path="my-proposals" element={<MyProposalsPage />} />
              <Route path="proposals" element={<MyProposalsPage />} />
              <Route path="earnings" element={<PaymentHistoryPage />} />
            </Route>

            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/jobs" element={<AdminJobsPage />} />
              <Route path="admin/reports" element={<AdminReportsPage />} />
              <Route path="admin/payments" element={<AdminPaymentsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Error Pages */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
    </>
  );
}
