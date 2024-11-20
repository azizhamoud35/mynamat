import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminDashboard } from '@/pages/dashboard/AdminDashboard';
import { CoachDashboard } from '@/pages/dashboard/CoachDashboard';
import { CustomerDashboard } from '@/pages/dashboard/CustomerDashboard';
import { HabitsPage } from '@/pages/features/HabitsPage';
import { SupportPage } from '@/pages/features/SupportPage';
import { CoachingPage } from '@/pages/features/CoachingPage';
import { EducationPage } from '@/pages/features/EducationPage';
import { PointsPage } from '@/pages/features/PointsPage';
import { SettingsPage } from '@/pages/features/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coach"
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <DashboardLayout>
                <CoachDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Feature Pages */}
        <Route
          path="/habits"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <HabitsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <SupportPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/coaching"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <CoachingPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <EducationPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/points"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <PointsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;