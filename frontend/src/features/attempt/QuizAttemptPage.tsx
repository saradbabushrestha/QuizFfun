import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, ChevronLeft, ChevronRight, Flag,
  AlertTriangle, Eye, Check, Lightbulb,
  Keyboard, BookOpen, ArrowRight, Send,
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAssessment, getQuestions, startAttempt, saveAttempt, submitAttempt } from '@/lib/api';
import { useParams } from 'react-router-dom';

export function QuizAttemptPage() {
  const navigate = useNavigate();
  const { id: assessmentId } = useParams();

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => getAssessment(assessmentId!),
    enabled: !!assessmentId,
  });

  const { data: attempt, isLoading: isLoadingAttempt } = useQuery({
    queryKey: ['startAttempt', assessmentId],
    queryFn: () => startAttempt(assessmentId!),
    enabled: !!assessmentId,
    refetchOnWindowFocus: false, // Don't restart attempt on focus
  });

  // Fetch all questions for all sections
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions'],
    queryFn: () => getQuestions(),
  });

  const assessmentQuestions = [];
  if (assessment && questions.length > 0) {
    const qIds = new Set();
    assessment.sections.forEach((s: any) => {
      s.questions.forEach((q: any) => qIds.add(q.id));
    });
    assessmentQuestions.push(...questions.filter((q: any) => qIds.has(q.id)));
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [showNavigator, setShowNavigator] = useState(true);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (assessment?.settings?.time_limit_minutes) {
      setTimeLeft(assessment.settings.time_limit_minutes * 60);
    }
  }, [assessment]);

  const currentQuestion = assessmentQuestions[currentIndex];
  const answered = Object.keys(answers).length;
  const progress = assessmentQuestions.length > 0 ? (answered / assessmentQuestions.length) * 100 : 0;

  const saveMutation = useMutation({
    mutationFn: (data: { answers: any, timeSpent: number }) => saveAttempt(attempt?.id, data.answers, data.timeSpent),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitAttempt(attempt?.id),
    onSuccess: () => {
      setTimeout(() => {
        navigate(`/results/${attempt?.id}`);
      }, 2000);
    }
  });

  // Autosave
  useEffect(() => {
    if (attempt?.id && Object.keys(answers).length > 0) {
      const timeout = setTimeout(() => {
        saveMutation.mutate({ answers, timeSpent: 0 }); // timeSpent omitted for simplicity
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [answers, attempt?.id]);

  // Timer
  useEffect(() => {
    if (isLoadingAssessment || !assessment) return;
    
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
  }, [isLoadingAssessment, assessment]);

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

  const goNext = useCallback(() => {
    if (currentIndex < assessmentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, assessmentQuestions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion.id)) newFlagged.delete(currentQuestion.id);
    else newFlagged.add(currentQuestion.id);
    setFlagged(newFlagged);
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  if (isLoadingAssessment || isLoadingAttempt || isLoadingQuestions) {
    return <div className="min-h-screen bg-surface-50 flex items-center justify-center">Loading attempt...</div>;
  }
  
  if (!assessment || assessmentQuestions.length === 0) {
    return <div className="min-h-screen bg-surface-50 flex items-center justify-center">Assessment not found or has no questions.</div>;
  }

  const isTimeLow = timeLeft < 300; // 5 minutes

  if (submitMutation.isSuccess) {
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
          <span className="text-xs text-surface-400">{currentIndex + 1} / {assessmentQuestions.length}</span>
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
                  <h3 className="text-surface-900 font-medium">Question {currentIndex + 1} of {assessmentQuestions.length}</h3>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-600' :
                    currentQuestion.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-rose-500/10 text-rose-600'
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
                {currentQuestion.options && currentQuestion.options.length > 0 && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option: any) => {
                      const isSelected = currentQuestion.type === 'multiple_choice'
                        ? ((answers[currentQuestion.id] as string[]) || []).includes(option.id)
                        : answers[currentQuestion.id] === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() => selectAnswer(option.id)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group",
                            isSelected
                              ? "border-primary-500 bg-primary-50"
                              : "border-surface-200 hover:border-primary-200 hover:bg-surface-50"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded flex items-center justify-center text-xs font-medium border transition-colors",
                            isSelected
                              ? "bg-primary-500 border-primary-500 text-white"
                              : "border-surface-300 text-surface-500 group-hover:border-primary-300"
                          )}>
                            {String.fromCharCode(65 + option.order)}
                          </div>
                          <span className={cn(
                            "flex-1",
                            isSelected ? "text-primary-900 font-medium" : "text-surface-700"
                          )}>
                            {option.text}
                          </span>
                        </button>
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

                  {currentIndex === assessmentQuestions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitMutation.isPending}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Submit Assessment'}
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={goNext}
                      className="flex items-center gap-2 px-6 py-3 bg-surface-900 hover:bg-surface-800 text-white rounded-xl font-medium transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
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
              <div className="p-4 flex flex-col h-full">
                <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Questions</h4>
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                  <div className="grid grid-cols-5 gap-2">
                    {assessmentQuestions.map((q, index) => {
                      const isAnswered = !!answers[q.id];
                      const isFlagged = flagged.has(q.id);
                      const isActive = currentIndex === index;

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(index)}
                          className={cn(
                            "aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all relative",
                            isActive
                              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                              : isAnswered
                                ? "bg-primary-50 text-primary-600 border border-primary-200"
                                : "bg-surface-100 text-surface-500 hover:bg-surface-200",
                            isFlagged && !isActive && "ring-2 ring-amber-400 ring-offset-2"
                          )}
                        >
                          {index + 1}
                          {isFlagged && isActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
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
