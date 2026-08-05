import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, ChevronLeft, ChevronRight, Flag,
  AlertTriangle, Eye, Check, Lightbulb,
  Keyboard, BookOpen, ArrowRight, Send,
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { mockAssessments, mockQuestions } from '@/lib/mock-data';
import type { Question } from '@/types';

export function QuizAttemptPage() {
  const navigate = useNavigate();
  const assessment = mockAssessments[0];
  const questions = mockQuestions.filter(q => q.bank_id === 'qb1');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState((assessment.settings.time_limit_minutes || 60) * 60);
  const [showNavigator, setShowNavigator] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'n') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'p') goPrev();
      else if (e.key === 'f') toggleFlag();
      else if (e.key >= '1' && e.key <= '9') {
        const optionIndex = parseInt(e.key) - 1;
        if (currentQuestion.options[optionIndex]) {
          selectAnswer(currentQuestion.options[optionIndex].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion]);

  const selectAnswer = useCallback((optionId: string) => {
    if (currentQuestion.type === 'multiple_choice') {
      const current = (answers[currentQuestion.id] as string[]) || [];
      setAnswers({
        ...answers,
        [currentQuestion.id]: current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId],
      });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: optionId });
    }
  }, [currentQuestion, answers]);

  const goNext = () => setCurrentIndex(Math.min(currentIndex + 1, questions.length - 1));
  const goPrev = () => setCurrentIndex(Math.max(currentIndex - 1, 0));
  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion.id)) newFlagged.delete(currentQuestion.id);
    else newFlagged.add(currentQuestion.id);
    setFlagged(newFlagged);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/results/a1'), 2000);
  };

  const isTimeLow = timeLeft < 300; // 5 minutes

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-surface-0 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-20 h-20 rounded-full bg-accent-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-accent-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Submitted!</h2>
          <p className="text-surface-500 mb-4">Your responses have been recorded.</p>
          <p className="text-sm text-surface-400">Redirecting to results...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-0 flex flex-col"
    >
      {/* Top Bar */}
      <div className="h-14 border-b border-surface-200/50 bg-surface-0/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-surface-900 truncate max-w-xs">{assessment.title}</h2>
          <span className="text-xs text-surface-400">{currentIndex + 1} / {questions.length}</span>
        </div>

        {/* Timer */}
        <motion.div
          animate={isTimeLow ? { scale: [1, 1.05, 1] } : {}}
          transition={isTimeLow ? { repeat: Infinity, duration: 1 } : {}}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-mono font-medium',
            isTimeLow ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' : 'bg-surface-100 text-surface-700 border border-surface-200/50'
          )}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </motion.div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlag}
            className={cn(
              'p-2 rounded-lg transition-colors',
              flagged.has(currentQuestion.id)
                ? 'bg-warning-500/10 text-warning-400'
                : 'text-surface-400 hover:text-surface-900 hover:bg-surface-100'
            )}
          >
            <Flag className="w-4 h-4" />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-accent-500/20"
          >
            <Send className="w-4 h-4" />
            Submit
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-surface-100">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Question Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Question Header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 bg-surface-100 border border-surface-200/50 rounded-lg text-xs font-medium text-surface-500">
                    Question {currentIndex + 1}
                  </span>
                  <span className="text-xs text-surface-400">{currentQuestion.points} points</span>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-medium border',
                    currentQuestion.difficulty === 'easy' ? 'text-accent-400 bg-accent-500/10 border-accent-500/20' :
                    currentQuestion.difficulty === 'medium' ? 'text-warning-400 bg-warning-500/10 border-warning-500/20' :
                    'text-danger-400 bg-danger-500/10 border-danger-500/20'
                  )}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-xl font-semibold text-surface-900 mb-2 leading-relaxed">
                  {currentQuestion.title}
                </h3>
                <p className="text-surface-500 text-sm mb-8 whitespace-pre-wrap">{currentQuestion.body}</p>

                {/* Options */}
                {currentQuestion.options.length > 0 && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => {
                      const isSelected = currentQuestion.type === 'multiple_choice'
                        ? ((answers[currentQuestion.id] as string[]) || []).includes(option.id)
                        : answers[currentQuestion.id] === option.id;

                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => selectAnswer(option.id)}
                          className={cn(
                            'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                            isSelected
                              ? 'border-primary-500/50 bg-primary-500/5'
                              : 'border-surface-200/50 hover:border-surface-300 bg-surface-50'
                          )}
                        >
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 transition-all',
                            isSelected
                              ? 'bg-primary-500 text-white'
                              : 'bg-surface-200/50 text-surface-500'
                          )}>
                            {isSelected ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                          </div>
                          <span className={cn(
                            'text-sm transition-colors',
                            isSelected ? 'text-surface-900 font-medium' : 'text-surface-700'
                          )}>
                            {option.text}
                          </span>
                          <span className="ml-auto text-xs text-surface-300 font-mono">
                            {i + 1}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Fill in the Blank */}
                {currentQuestion.type === 'fill_blank' && (
                  <input
                    type="text"
                    value={(answers[currentQuestion.id] as string) || ''}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-primary-500/50 transition-all"
                  />
                )}

                {/* Essay */}
                {currentQuestion.type === 'essay' && (
                  <textarea
                    value={(answers[currentQuestion.id] as string) || ''}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                    placeholder="Write your answer..."
                    rows={8}
                    className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-primary-500/50 transition-all resize-none"
                  />
                )}

                {/* Hint */}
                {currentQuestion.hint && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 text-xs text-warning-400 hover:text-warning-300 transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 p-3 rounded-xl bg-warning-500/5 border border-warning-500/20 text-xs text-warning-300"
                        >
                          💡 {currentQuestion.hint}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                      currentIndex === 0
                        ? 'text-surface-300 cursor-not-allowed'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200 border border-surface-200/50'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={currentIndex === questions.length - 1 ? handleSubmit : goNext}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                      currentIndex === questions.length - 1
                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/20'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                    )}
                  >
                    {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
                    {currentIndex === questions.length - 1 ? <Send className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Question Navigator */}
        <AnimatePresence>
          {showNavigator && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-surface-200/50 bg-surface-50/50 overflow-hidden"
            >
              <div className="p-4">
                <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Questions</h4>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, i) => {
                    const isAnswered = q.id in answers;
                    const isFlagged = flagged.has(q.id);
                    const isCurrent = i === currentIndex;

                    return (
                      <motion.button
                        key={q.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                          'w-10 h-10 rounded-xl text-xs font-medium relative transition-all',
                          isCurrent ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' :
                          isAnswered ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' :
                          'bg-surface-100 text-surface-500 border border-surface-200/50 hover:border-surface-300'
                        )}
                      >
                        {i + 1}
                        {isFlagged && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning-400 rounded-full" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 space-y-2 text-xs text-surface-500">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary-500" />
                    Current
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-accent-500/10 border border-accent-500/20" />
                    Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-surface-100 border border-surface-200/50" />
                    Unanswered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-surface-100 border border-surface-200/50 relative">
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-warning-400 rounded-full" />
                    </div>
                    Flagged
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div className="mt-6 p-3 rounded-xl bg-surface-100/50 border border-surface-200/30">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Keyboard className="w-3 h-3 text-surface-400" />
                    <span className="text-[10px] font-semibold text-surface-500">Shortcuts</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-surface-400">
                    <div className="flex justify-between">
                      <span>Next</span>
                      <kbd className="px-1 bg-surface-200/50 rounded font-mono">→</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Previous</span>
                      <kbd className="px-1 bg-surface-200/50 rounded font-mono">←</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Flag</span>
                      <kbd className="px-1 bg-surface-200/50 rounded font-mono">F</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Select 1-9</span>
                      <kbd className="px-1 bg-surface-200/50 rounded font-mono">1-9</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
