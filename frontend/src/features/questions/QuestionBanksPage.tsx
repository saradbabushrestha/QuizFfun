import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, BookOpen, MoreHorizontal,
  Tag, Calendar, Hash, ChevronRight, Folder,
  Edit3, Trash2, Copy, ArrowUpRight, SlidersHorizontal,
} from 'lucide-react';
import { cn, DIFFICULTY_COLORS } from '@/lib/utils';
import { getQuestionBanks, getQuestions } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Question } from '@/types';

/* ============================================
   Question Banks Page
   ============================================ */
export function QuestionBanksPage() {
  const [search, setSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'banks' | 'questions'>('banks');

  const { data: banks = [], isLoading: isLoadingBanks } = useQuery({
    queryKey: ['question-banks'],
    queryFn: getQuestionBanks
  });

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', selectedBank],
    queryFn: () => getQuestions(selectedBank || undefined),
    enabled: !!selectedBank || viewMode === 'questions'
  });

  const filteredBanks = banks.filter(
    (b: any) => b.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredQuestions = selectedBank
    ? questions.filter((q: any) => q.bank_id === selectedBank)
    : questions;

  const questionsToShow = filteredQuestions.filter(
    (q) => q.title.toLowerCase().includes(search.toLowerCase())
  );

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
            Question Bank
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 text-sm mt-1"
          >
            {mockQuestionBanks.length} banks · {mockQuestions.length} questions
          </motion.p>
        </div>
        <Link to="/app/questions/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4" />
            New Question
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
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-50 border border-surface-200/50 rounded-xl">
          <button
            onClick={() => { setViewMode('banks'); setSelectedBank(null); }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              viewMode === 'banks' ? 'bg-primary-500/10 text-primary-400' : 'text-surface-500 hover:text-surface-900'
            )}
          >
            Banks
          </button>
          <button
            onClick={() => setViewMode('questions')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              viewMode === 'questions' ? 'bg-primary-500/10 text-primary-400' : 'text-surface-500 hover:text-surface-900'
            )}
          >
            All Questions
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </motion.button>
      </motion.div>

      {/* Banks Grid / Questions List */}
      <AnimatePresence mode="wait">
        {viewMode === 'banks' && !selectedBank ? (
          <motion.div
            key="banks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredBanks.map((bank, i) => (
              <motion.div
                key={bank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => { setSelectedBank(bank.id); setViewMode('questions'); }}
                className="group p-6 rounded-2xl bg-surface-50 border border-surface-200/50 hover:border-primary-500/20 cursor-pointer transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/[0.02] group-hover:to-secondary-500/[0.02] transition-all" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <Folder className="w-5 h-5 text-primary-400" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-surface-900 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-surface-900 mb-1">{bank.name}</h3>
                  <p className="text-xs text-surface-500 mb-4 line-clamp-2">{bank.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-surface-400">
                      <Hash className="w-3 h-3" />
                      {bank.question_count} questions
                    </div>
                    <div className="flex gap-1">
                      {bank.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-surface-200/50 text-surface-500 rounded-md text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {selectedBank && (
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => { setSelectedBank(null); setViewMode('banks'); }}
                  className="text-xs text-surface-400 hover:text-surface-900 transition-colors"
                >
                  Banks
                </button>
                <ChevronRight className="w-3 h-3 text-surface-300" />
                <span className="text-xs font-medium text-surface-900">
                  {mockQuestionBanks.find(b => b.id === selectedBank)?.name}
                </span>
              </div>
            )}

            <div className="space-y-2">
              {questionsToShow.map((question, i) => (
                <QuestionRow key={question.id} question={question} index={i} />
              ))}
              {questionsToShow.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500 font-medium">No questions found</p>
                  <p className="text-surface-400 text-sm mt-1">Try adjusting your search or create a new question</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   Question Row Component
   ============================================ */
function QuestionRow({ question, index }: { question: Question; index: number }) {
  const typeLabels: Record<string, string> = {
    single_choice: 'Single Choice',
    multiple_choice: 'Multiple Choice',
    true_false: 'True/False',
    fill_blank: 'Fill Blank',
    essay: 'Essay',
    matching: 'Matching',
    ordering: 'Ordering',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200/50 hover:border-surface-300/50 transition-all cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-surface-200/50 flex items-center justify-center text-xs font-mono text-surface-500 shrink-0">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 truncate">{question.title}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-surface-400">{typeLabels[question.type] || question.type}</span>
          <span className="text-xs text-surface-300">·</span>
          <span className="text-xs text-surface-400">{question.points} pts</span>
          <span className="text-xs text-surface-300">·</span>
          <span className={cn('text-xs px-1.5 py-0.5 rounded border', DIFFICULTY_COLORS[question.difficulty])}>
            {question.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {question.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-surface-200/50 text-surface-500 rounded-md text-[10px] font-medium hidden lg:block">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-danger-500/10 text-surface-400 hover:text-danger-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
