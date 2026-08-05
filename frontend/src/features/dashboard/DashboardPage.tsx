import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, BookOpen, Users, TrendingUp,
  BarChart3, Clock, Target, ArrowUpRight,
  Plus, ChevronRight, Activity, Award,
  CheckCircle2, AlertCircle, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell,
} from 'recharts';
import { mockDashboardStats, mockActivities, mockAnalytics } from '@/lib/mock-data';
import { getAssessments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

/* ============================================
   Stat Card Component
   ============================================ */
interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  trend?: number;
  gradient: string;
  delay: number;
}

function StatCard({ title, value, suffix = '', icon: Icon, trend, gradient, delay }: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-surface-50 border border-surface-200/50 hover:border-surface-300/50 transition-all overflow-hidden"
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md opacity-90`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
            trend >= 0 ? 'text-accent-400 bg-accent-500/10' : 'text-danger-400 bg-danger-500/10'
          )}>
            <TrendingUp className={cn('w-3 h-3', trend < 0 && 'rotate-180')} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-surface-900 mb-1">
        {isInView ? value : '0'}
        {suffix}
      </div>
      <p className="text-sm text-surface-500">{title}</p>
    </motion.div>
  );
}

/* ============================================
   Dashboard Page
   ============================================ */
export function DashboardPage() {
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['assessments'],
    queryFn: getAssessments
  });
  const CHART_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f97316', '#ef4444'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-surface-900"
          >
            Good morning, Sarah 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 text-sm mt-1"
          >
            Here's what's happening with your assessments today.
          </motion.p>
        </div>
        <Link to="/app/assessments/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </motion.button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assessments"
          value={mockDashboardStats.total_assessments}
          icon={FileText}
          trend={12}
          gradient="from-primary-500 to-primary-600"
          delay={0}
        />
        <StatCard
          title="Total Questions"
          value={mockDashboardStats.total_questions}
          icon={BookOpen}
          trend={8}
          gradient="from-secondary-500 to-secondary-600"
          delay={0.1}
        />
        <StatCard
          title="Total Attempts"
          value={mockDashboardStats.total_attempts}
          icon={Users}
          trend={23}
          gradient="from-accent-500 to-accent-600"
          delay={0.2}
        />
        <StatCard
          title="Average Score"
          value={mockDashboardStats.avg_score}
          suffix="%"
          icon={Target}
          trend={5}
          gradient="from-warning-500 to-warning-600"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-surface-900">Performance Trend</h3>
              <p className="text-xs text-surface-500 mt-0.5">Average score and attempts over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-surface-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded-full bg-primary-500" />
                Score
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded-full bg-secondary-400" />
                Attempts
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockAnalytics.performance_trend}>
              <defs>
                <linearGradient id="gradientScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientAttempts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="avg_score" stroke="#3b82f6" strokeWidth={2} fill="url(#gradientScore)" />
              <Area type="monotone" dataKey="attempts" stroke="#a855f7" strokeWidth={2} fill="url(#gradientAttempts)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-1">Score Distribution</h3>
          <p className="text-xs text-surface-500 mb-6">How students are performing</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={mockAnalytics.score_distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="count"
              >
                {mockAnalytics.score_distribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {mockAnalytics.score_distribution.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-surface-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                {item.range}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Assessments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assessments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-surface-900">Recent Assessments</h3>
            <Link to="/app/assessments" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockAssessments.slice(0, 4).map((assessment, i) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-100/50 transition-colors cursor-pointer group"
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  assessment.status === 'published' ? 'bg-accent-500/10 text-accent-400' : 'bg-surface-200 text-surface-500'
                )}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{assessment.title}</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {assessment.total_questions} questions · {assessment.attempts_count} attempts
                  </p>
                </div>
                <div className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium border',
                  assessment.status === 'published' ? 'text-accent-400 bg-accent-500/10 border-accent-500/20' :
                  assessment.status === 'draft' ? 'text-surface-500 bg-surface-200/50 border-surface-300/30' :
                  'text-warning-400 bg-warning-500/10 border-warning-500/20'
                )}>
                  {assessment.status}
                </div>
                <ArrowUpRight className="w-4 h-4 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivities.slice(0, 6).map((activity, i) => {
              const iconMap = {
                attempt_completed: CheckCircle2,
                quiz_published: Sparkles,
                certificate_issued: Award,
                question_added: BookOpen,
                user_joined: Users,
                quiz_created: FileText,
              };
              const colorMap = {
                attempt_completed: 'text-accent-400',
                quiz_published: 'text-primary-400',
                certificate_issued: 'text-warning-400',
                question_added: 'text-secondary-400',
                user_joined: 'text-primary-400',
                quiz_created: 'text-primary-400',
              };
              const Icon = iconMap[activity.type] || Activity;
              const color = colorMap[activity.type] || 'text-surface-400';

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={cn('mt-0.5 shrink-0', color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-surface-700 leading-snug">{activity.description}</p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
