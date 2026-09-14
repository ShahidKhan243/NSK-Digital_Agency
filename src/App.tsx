import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/public/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { StartProjectPage } from './pages/StartProjectPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Customer Portal Pages
import { DashboardPage } from './pages/portal/DashboardPage';
import { ProjectWorkspacePage } from './pages/portal/ProjectWorkspacePage';

// Employee Portal Pages & Guards
import { EmployeeLoginPage } from './pages/employee/EmployeeLoginPage';
import { EmployeeRouteGuard } from './components/auth/EmployeeRouteGuard';
import { EmployeeLayout } from './layouts/EmployeeLayout';
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage';

// Admin Suite Pages & Guards
import { AdminGatewayPage } from './pages/admin/AdminGatewayPage';
import { AdminRouteGuard } from './components/auth/AdminRouteGuard';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminEmployeesPage } from './pages/admin/AdminEmployeesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminQuotationsPage } from './pages/admin/AdminQuotationsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { pathname } = useLocation();
  const isAdminOrEmployeeWorkspace = pathname.startsWith('/admin') || pathname.startsWith('/employee');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Show Global Navbar only on non-admin/employee pages */}
      {!isAdminOrEmployeeWorkspace && <Navbar />}

      {/* Dynamic Route Pages */}
      <main className="flex-1">
        <Routes>
          {/* 1. Public Agency Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/start-project" element={<StartProjectPage />} />
          <Route path="/quote" element={<Navigate to="/start-project" replace />} />
          <Route path="/portfolio" element={<Navigate to="/services" replace />} />
          <Route path="/portfolio/*" element={<Navigate to="/services" replace />} />
          
          {/* 2. Customer Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 3. Customer Workspace */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<DashboardPage />} />
          <Route path="/projects/:id" element={<ProjectWorkspacePage />} />

          {/* 4. Private Employee Portal */}
          <Route path="/employee/login" element={<EmployeeLoginPage />} />
          <Route 
            path="/employee" 
            element={
              <EmployeeRouteGuard />
            }
          >
            <Route element={<EmployeeLayout />}>
              <Route index element={<EmployeeDashboardPage />} />
            </Route>
          </Route>

          {/* 5. Admin Security Gateway */}
          <Route path="/admin/gateway" element={<AdminGatewayPage />} />

          {/* 6. Protected Admin Suite */}
          <Route 
            path="/admin" 
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="projects" element={<AdminOrdersPage />} />
            <Route path="employees" element={<AdminEmployeesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="quotations" element={<AdminQuotationsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer only on public/customer pages */}
      {!isAdminOrEmployeeWorkspace && <Footer />}

      {/* Floating WhatsApp Widget */}
      {!isAdminOrEmployeeWorkspace && <WhatsAppButton />}

    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
