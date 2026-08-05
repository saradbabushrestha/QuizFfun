import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';
import { SignInPage } from '@/features/auth/SignInPage';
import { SignUpPage } from '@/features/auth/SignUpPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { QuestionBanksPage } from '@/features/questions/QuestionBanksPage';
import { QuestionBuilderPage } from '@/features/questions/QuestionBuilderPage';
import { AssessmentsPage } from '@/features/assessments/AssessmentsPage';
import { AssessmentBuilderPage } from '@/features/assessments/AssessmentBuilderPage';
import { QuizAttemptPage } from '@/features/attempt/QuizAttemptPage';
import { QuizResultsPage } from '@/features/attempt/QuizResultsPage';
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage';
import { CertificatesPage } from '@/features/certificates/CertificatesPage';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Quiz Attempt (separate layout) */}
        <Route path="/attempt/:id" element={<QuizAttemptPage />} />
        <Route path="/results/:id" element={<QuizResultsPage />} />

        {/* App Routes (with sidebar layout) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="questions" element={<QuestionBanksPage />} />
          <Route path="questions/new" element={<QuestionBuilderPage />} />
          <Route path="questions/:id" element={<QuestionBuilderPage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="assessments/new" element={<AssessmentBuilderPage />} />
          <Route path="assessments/:id" element={<AssessmentBuilderPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
