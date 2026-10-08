import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/common/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { CareersPage } from './pages/CareersPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { QuickFillPage } from './pages/QuickFillPage';
import { MobileUploadPage } from './pages/MobileUploadPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SkillsPage } from './pages/SkillsPage';
import { ResumePage } from './pages/ResumePage';
import { JobAnalysisPage } from './pages/JobAnalysisPage';
import { JobAnalysisDetailPage } from './pages/JobAnalysisDetailPage';
import { ComparePage } from './pages/ComparePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { RoadmapDetailPage } from './pages/RoadmapDetailPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CertificationsPage } from './pages/CertificationsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <span className="text-xs text-zinc-500 font-medium">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/quick-fill" element={<QuickFillPage />} />
          <Route path="/mobile-upload/:token" element={<MobileUploadPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/job-analysis" element={<JobAnalysisPage />} />
            <Route path="/job-analysis/:id" element={<JobAnalysisDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/roadmap/:id" element={<RoadmapDetailPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
