import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Target,
  BookOpen, Clock, Award, Filter,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { mockAnalytics, mockDashboardStats } from '@/lib/mock-data';

const CHART_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f97316', '#ef4444'];

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-surface-900"
          >
            Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 text-sm mt-1"
          >
            Comprehensive insights into assessment performance
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-500 hover:text-surface-900 transition-all"
        >
          <Filter className="w-4 h-4" />
          Date Range
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: mockDashboardStats.completion_rate, suffix: '%', icon: Target, color: 'text-accent-400', gradient: 'from-accent-500 to-accent-600' },
          { label: 'Avg Score', value: mockDashboardStats.avg_score, suffix: '%', icon: BarChart3, color: 'text-primary-400', gradient: 'from-primary-500 to-primary-600' },
          { label: 'This Month', value: mockDashboardStats.attempts_this_month, suffix: '', icon: TrendingUp, color: 'text-secondary-400', gradient: 'from-secondary-500 to-secondary-600' },
          { label: 'Active Students', value: mockDashboardStats.total_students, suffix: '', icon: Users, color: 'text-warning-400', gradient: 'from-warning-500 to-warning-600' },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl bg-surface-50 border border-surface-200/50"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-3`}>
              <metric.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-surface-900">
              {metric.value}
              {metric.suffix}
            </p>
            <p className="text-xs text-surface-500 mt-1">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-1">Performance Trend</h3>
          <p className="text-xs text-surface-500 mb-6">Average score over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockAnalytics.performance_trend}>
              <defs>
                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#f4f4f5', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="avg_score" stroke="#3b82f6" strokeWidth={2} fill="url(#analyticsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Topic Mastery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-1">Topic Mastery</h3>
          <p className="text-xs text-surface-500 mb-6">Average score by topic</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={mockAnalytics.topic_mastery}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="topic" tick={{ fill: '#71717a', fontSize: 10 }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-1">Question Types</h3>
          <p className="text-xs text-surface-500 mb-6">Distribution across assessments</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={mockAnalytics.question_type_distribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="count">
                {mockAnalytics.question_type_distribution.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#f4f4f5', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {mockAnalytics.question_type_distribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-surface-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  {item.type}
                </div>
                <span className="text-surface-700 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Assessments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-1">Top Assessments</h3>
          <p className="text-xs text-surface-500 mb-6">By number of attempts</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAnalytics.top_assessments} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#f4f4f5', fontSize: '12px' }} />
              <Bar dataKey="attempts" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50"
        >
          <h3 className="text-base font-semibold text-surface-900 mb-1">Difficulty Split</h3>
          <p className="text-xs text-surface-500 mb-6">Questions by difficulty</p>
          <div className="space-y-4 mt-8">
            {mockAnalytics.difficulty_distribution.map((item, i) => {
              const total = mockAnalytics.difficulty_distribution.reduce((s, d) => s + d.count, 0);
              const percentage = Math.round((item.count / total) * 100);
              const colors = ['#10b981', '#f97316', '#ef4444'];

              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-surface-700 font-medium">{item.difficulty}</span>
                    <span className="text-surface-400">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-surface-200/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors[i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
