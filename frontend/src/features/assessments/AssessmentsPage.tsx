import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, FileText, MoreHorizontal, Users,
  Clock, Target, BarChart3, ChevronRight,
  Play, Edit3, Copy, Trash2, ArrowUpRight,
  Eye, Calendar, SlidersHorizontal,
} from 'lucide-react';
import { cn, STATUS_COLORS, formatDate } from '@/lib/utils';
import { mockAssessments } from '@/lib/mock-data';

export function AssessmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockAssessments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-surface-900"
          >
            Assessments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 text-sm mt-1"
          >
            {mockAssessments.length} assessments · {mockAssessments.filter(a => a.status === 'published').length} published
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

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assessments..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-50 border border-surface-200/50 rounded-xl">
          {['all', 'published', 'draft', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                statusFilter === status ? 'bg-primary-500/10 text-primary-400' : 'text-surface-500 hover:text-surface-900'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((assessment, i) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group p-6 rounded-2xl bg-surface-50 border border-surface-200/50 hover:border-surface-300/50 transition-all relative overflow-hidden"
          >
            {/* Top gradient accent */}
            <div className={cn(
              'absolute top-0 left-0 right-0 h-px bg-gradient-to-r',
              assessment.status === 'published' ? 'from-accent-500 to-accent-600' :
              assessment.status === 'draft' ? 'from-surface-400 to-surface-500' :
              'from-warning-500 to-warning-600'
            )} />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  assessment.status === 'published' ? 'bg-accent-500/10 text-accent-400' : 'bg-surface-200 text-surface-500'
                )}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium border', STATUS_COLORS[assessment.status] || '')}>
                  {assessment.status}
                </span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-surface-900 transition-all p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-semibold text-surface-900 mb-1">{assessment.title}</h3>
            <p className="text-xs text-surface-500 mb-4 line-clamp-2">{assessment.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-surface-100/50">
                <p className="text-sm font-semibold text-surface-900">{assessment.total_questions}</p>
                <p className="text-[10px] text-surface-400">Questions</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-100/50">
                <p className="text-sm font-semibold text-surface-900">{assessment.attempts_count}</p>
                <p className="text-[10px] text-surface-400">Attempts</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-100/50">
                <p className="text-sm font-semibold text-surface-900">{assessment.avg_score || '—'}%</p>
                <p className="text-[10px] text-surface-400">Avg Score</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-100/50">
                <p className="text-sm font-semibold text-surface-900">{assessment.settings.time_limit_minutes || '∞'}</p>
                <p className="text-[10px] text-surface-400">Minutes</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {assessment.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-surface-200/50 text-surface-500 rounded-md text-[10px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {assessment.status === 'published' && (
                  <Link to={`/attempt/${assessment.id}`}>
                    <button className="p-1.5 rounded-lg hover:bg-accent-500/10 text-surface-400 hover:text-accent-400 transition-colors">
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                )}
                <Link to={`/app/assessments/${assessment.id}`}>
                  <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 font-medium">No assessments found</p>
          <p className="text-surface-400 text-sm mt-1">Try adjusting your search or create a new assessment</p>
        </div>
      )}
    </div>
  );
}
