import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check, X, Clock, Award, BarChart3, ArrowRight,
  Home, RotateCcw, Download, ChevronRight,
  CheckCircle2, XCircle, Trophy, AlertTriangle,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { mockAttempts, mockQuestions, mockAnalytics } from '@/lib/mock-data';

export function QuizResultsPage() {
  const navigate = useNavigate();
  const attempt = mockAttempts[0];
  const questions = mockQuestions.filter(q => q.bank_id === 'qb1');
  const passed = attempt.percentage >= 70;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-0"
    >
      {/* Hero Result */}
      <div className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className={cn(
              'absolute top-10 left-1/4 w-80 h-80 rounded-full blur-[100px]',
              passed ? 'bg-accent-500/20' : 'bg-danger-500/15'
            )}
          />
          <motion.div
            animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className={cn(
              'absolute bottom-10 right-1/4 w-80 h-80 rounded-full blur-[100px]',
              passed ? 'bg-primary-500/15' : 'bg-warning-500/15'
            )}
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Score Circle */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
            className="mx-auto mb-8"
          >
            <div className={cn(
              'w-40 h-40 rounded-full flex items-center justify-center mx-auto relative',
              passed ? 'bg-accent-500/10 border-4 border-accent-500/30' : 'bg-danger-500/10 border-4 border-danger-500/30'
            )}>
              {/* Animated ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="3" fill="none" className="text-surface-200/30" />
                <motion.circle
                  cx="80" cy="80" r="72"
                  stroke={passed ? '#10b981' : '#ef4444'}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: attempt.percentage / 100 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  style={{ pathLength: 0 }}
                  strokeDasharray="452.39"
                />
              </svg>
              <div>
                <div className={cn('text-4xl font-bold', passed ? 'text-accent-400' : 'text-danger-400')}>
                  {attempt.percentage}%
                </div>
                <div className="text-xs text-surface-400 mt-1">Score</div>
              </div>
            </div>
          </motion.div>

          {/* Result Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className={cn(
              'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-4',
              passed
                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                : 'bg-danger-500/10 text-danger-400 border border-danger-500/20'
            )}>
              {passed ? <Trophy className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </div>
            <p className="text-surface-500 text-sm">
              You scored {attempt.score}/{attempt.total_points} points on JavaScript Mastery Test
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            {[
              { icon: CheckCircle2, label: 'Correct', value: attempt.responses.filter(r => r.is_correct).length, color: 'text-accent-400' },
              { icon: XCircle, label: 'Incorrect', value: attempt.responses.filter(r => !r.is_correct).length, color: 'text-danger-400' },
              { icon: Clock, label: 'Time', value: `${Math.floor(attempt.time_spent_seconds / 60)}m`, color: 'text-primary-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className={cn('w-5 h-5 mx-auto mb-1', stat.color)} />
                <p className="text-lg font-bold text-surface-900">{stat.value}</p>
                <p className="text-xs text-surface-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-100 border border-surface-200/50 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </motion.button>
            {passed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app/certificates')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-warning-500/20"
              >
                <Award className="w-4 h-4" />
                View Certificate
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="max-w-4xl mx-auto px-6 pb-16 space-y-8">
        {/* Topic Mastery Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
            <h3 className="text-base font-semibold text-surface-900 mb-4">Topic Mastery</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={mockAnalytics.topic_mastery}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#71717a', fontSize: 10 }} />
                <PolarRadiusAxis tick={false} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
            <h3 className="text-base font-semibold text-surface-900 mb-4">Time per Question</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockAnalytics.time_analysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="question" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}s`, 'Time']}
                />
                <Bar dataKey="avg_time" radius={[6, 6, 0, 0]}>
                  {mockAnalytics.time_analysis.map((_, index) => (
                    <Cell key={index} fill={index === 4 ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-6">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, i) => {
              const response = attempt.responses[i];
              if (!response) return null;

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 + i * 0.05 }}
                  className={cn(
                    'p-4 rounded-xl border-l-4',
                    response.is_correct
                      ? 'bg-accent-500/5 border-accent-500'
                      : 'bg-danger-500/5 border-danger-500'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      response.is_correct ? 'bg-accent-500/10 text-accent-400' : 'bg-danger-500/10 text-danger-400'
                    )}>
                      {response.is_correct ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900">{question.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-surface-400">
                          {response.points_earned}/{question.points} pts
                        </span>
                        <span className="text-xs text-surface-300">·</span>
                        <span className="text-xs text-surface-400">
                          {response.time_spent_seconds}s
                        </span>
                      </div>
                      {question.explanation && (
                        <p className="text-xs text-surface-500 mt-2 p-2 rounded-lg bg-surface-100/50">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
