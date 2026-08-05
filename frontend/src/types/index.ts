/* ============================================
   QuizForge Type Definitions
   ============================================ */

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'essay'
  | 'matching'
  | 'ordering';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AssessmentStatus = 'draft' | 'published' | 'archived';

export type AttemptStatus = 'in_progress' | 'submitted' | 'graded';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student';
  organization_id: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  question_count: number;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface Question {
  id: string;
  bank_id: string;
  type: QuestionType;
  title: string;
  body: string;
  options: QuestionOption[];
  correct_answer?: string;
  explanation?: string;
  hint?: string;
  points: number;
  difficulty: Difficulty;
  tags: string[];
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface AssessmentSettings {
  time_limit_minutes?: number;
  max_attempts: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results: boolean;
  show_correct_answers: boolean;
  passing_score: number;
  negative_marking: boolean;
  negative_marks_percentage: number;
  require_fullscreen: boolean;
  allow_backtracking: boolean;
  auto_submit: boolean;
  show_leaderboard: boolean;
  certificate_enabled: boolean;
  password?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  status: AssessmentStatus;
  sections: AssessmentSection[];
  settings: AssessmentSettings;
  total_points: number;
  total_questions: number;
  attempts_count: number;
  avg_score: number;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Response {
  question_id: string;
  answer: string | string[];
  time_spent_seconds: number;
  is_correct?: boolean;
  points_earned: number;
}

export interface Attempt {
  id: string;
  assessment_id: string;
  student_id: string;
  student_name: string;
  status: AttemptStatus;
  score: number;
  total_points: number;
  percentage: number;
  responses: Response[];
  started_at: string;
  submitted_at?: string;
  time_spent_seconds: number;
}

export interface Certificate {
  id: string;
  attempt_id: string;
  assessment_title: string;
  student_name: string;
  score: number;
  percentage: number;
  issued_at: string;
  verification_code: string;
  template: string;
}

export interface Activity {
  id: string;
  type: 'quiz_created' | 'quiz_published' | 'attempt_completed' | 'certificate_issued' | 'question_added' | 'user_joined';
  title: string;
  description: string;
  user_name: string;
  user_avatar?: string;
  timestamp: string;
}

export interface DashboardStats {
  total_assessments: number;
  total_questions: number;
  total_attempts: number;
  total_students: number;
  avg_score: number;
  completion_rate: number;
  assessments_this_month: number;
  attempts_this_month: number;
}

export interface AnalyticsData {
  performance_trend: { date: string; avg_score: number; attempts: number }[];
  difficulty_distribution: { difficulty: string; count: number }[];
  question_type_distribution: { type: string; count: number }[];
  top_assessments: { name: string; attempts: number; avg_score: number }[];
  topic_mastery: { topic: string; score: number }[];
  score_distribution: { range: string; count: number }[];
  time_analysis: { question: string; avg_time: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}
