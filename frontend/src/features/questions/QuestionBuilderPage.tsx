import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft, Plus, Trash2, Eye, Save,
  Lightbulb, MessageSquare, Tag, BarChart2,
  GripVertical, Check, X, Image, Code,
} from 'lucide-react';
import { cn, DIFFICULTY_COLORS } from '@/lib/utils';
import type { QuestionType, Difficulty, QuestionOption } from '@/types';
import { generateId } from '@/lib/utils';

/* ============================================
   Question Builder Page
   ============================================ */
export function QuestionBuilderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<QuestionType>('single_choice');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [points, setPoints] = useState(10);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: generateId(), text: '', is_correct: false, order: 0 },
    { id: generateId(), text: '', is_correct: false, order: 1 },
    { id: generateId(), text: '', is_correct: false, order: 2 },
    { id: generateId(), text: '', is_correct: false, order: 3 },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'question' | 'settings'>('question');

  const questionTypes: { value: QuestionType; label: string; description: string }[] = [
    { value: 'single_choice', label: 'Single Choice', description: 'One correct answer' },
    { value: 'multiple_choice', label: 'Multiple Choice', description: 'Multiple correct answers' },
    { value: 'true_false', label: 'True / False', description: 'Binary choice' },
    { value: 'fill_blank', label: 'Fill in the Blank', description: 'Text input answer' },
    { value: 'essay', label: 'Essay', description: 'Long form response' },
  ];

  const addOption = () => {
    setOptions([...options, { id: generateId(), text: '', is_correct: false, order: options.length }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
  };

  const updateOption = (id: string, updates: Partial<QuestionOption>) => {
    setOptions(options.map((o) => {
      if (o.id !== id) {
        if (type === 'single_choice' && updates.is_correct) {
          return { ...o, is_correct: false };
        }
        return o;
      }
      return { ...o, ...updates };
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSave = () => {
    toast.success('Question saved successfully!', {
      description: 'Your question has been added to the bank.',
    });
    navigate('/app/questions');
  };

  const hasOptions = ['single_choice', 'multiple_choice', 'true_false'].includes(type);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/app/questions')}
            className="p-2 rounded-xl bg-surface-50 border border-surface-200/50 text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-surface-900">New Question</h1>
            <p className="text-xs text-surface-500 mt-0.5">Create a new question for your bank</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-500 hover:text-surface-900 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20"
          >
            <Save className="w-4 h-4" />
            Save Question
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-50 border border-surface-200/50 rounded-xl w-fit">
        {(['question', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'relative px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab ? 'text-primary-400' : 'text-surface-500 hover:text-surface-900'
            )}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="question-tab"
                className="absolute inset-0 bg-primary-500/10 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative capitalize">{tab}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'question' ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Question Type Selector */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
              <label className="block text-sm font-medium text-surface-900 mb-3">Question Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {questionTypes.map((qt) => (
                  <motion.button
                    key={qt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setType(qt.value);
                      if (qt.value === 'true_false') {
                        setOptions([
                          { id: generateId(), text: 'True', is_correct: false, order: 0 },
                          { id: generateId(), text: 'False', is_correct: false, order: 1 },
                        ]);
                      }
                    }}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all',
                      type === qt.value
                        ? 'bg-primary-500/10 border-primary-500/30 text-primary-400'
                        : 'bg-surface-100/50 border-surface-200/50 text-surface-500 hover:border-surface-300'
                    )}
                  >
                    <p className="text-xs font-medium">{qt.label}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{qt.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Question Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter question title..."
                  className="w-full px-4 py-3 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Question Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter the full question text. You can use markdown for formatting..."
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none"
                />
                <div className="flex items-center gap-3 mt-2">
                  <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
                    <Code className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            {hasOptions && (
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
                <label className="block text-sm font-medium text-surface-900 mb-4">
                  Answer Options
                  <span className="text-xs text-surface-400 font-normal ml-2">
                    {type === 'single_choice' ? 'Select one correct answer' : 'Select all correct answers'}
                  </span>
                </label>
                <div className="space-y-2">
                  {options.map((option, i) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="text-surface-300 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button
                        onClick={() => updateOption(option.id, { is_correct: !option.is_correct })}
                        className={cn(
                          'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                          option.is_correct
                            ? 'bg-accent-500 border-accent-500 text-white'
                            : 'border-surface-300 hover:border-surface-400'
                        )}
                      >
                        {option.is_correct && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(option.id, { text: e.target.value })}
                        placeholder={`Option ${i + 1}`}
                        className={cn(
                          'flex-1 px-3 py-2 bg-surface-100 border rounded-lg text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all',
                          option.is_correct ? 'border-accent-500/30' : 'border-surface-200/50'
                        )}
                      />
                      <button
                        onClick={() => removeOption(option.id)}
                        className="p-1.5 rounded-lg hover:bg-danger-500/10 text-surface-400 hover:text-danger-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {type !== 'true_false' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addOption}
                    className="flex items-center gap-2 mt-3 px-4 py-2 border border-dashed border-surface-300 rounded-xl text-sm text-surface-500 hover:text-surface-900 hover:border-surface-400 transition-colors w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </motion.button>
                )}
              </div>
            )}

            {/* Fill in the Blank */}
            {type === 'fill_blank' && (
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
                <label className="block text-sm font-medium text-surface-900 mb-2">Correct Answer</label>
                <input
                  type="text"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Enter the correct answer..."
                  className="w-full px-4 py-3 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                />
                <p className="text-xs text-surface-400 mt-2">Case-insensitive matching will be used by default.</p>
              </div>
            )}

            {/* Explanation & Hint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-accent-400" />
                  <label className="text-sm font-medium text-surface-900">Explanation</label>
                </div>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain the correct answer..."
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none"
                />
              </div>
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-warning-400" />
                  <label className="text-sm font-medium text-surface-900">Hint</label>
                </div>
                <textarea
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Give students a helpful hint..."
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Difficulty & Points */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-3">Difficulty</label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                      <motion.button
                        key={d}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDifficulty(d)}
                        className={cn(
                          'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize',
                          difficulty === d ? DIFFICULTY_COLORS[d] : 'bg-surface-100/50 border-surface-200/50 text-surface-500'
                        )}
                      >
                        {d}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-3">Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full px-4 py-2.5 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-secondary-400" />
                <label className="text-sm font-medium text-surface-900">Tags</label>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-secondary-500/10 text-secondary-400 rounded-lg text-xs font-medium"
                  >
                    {tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 bg-surface-100 border border-surface-200/50 rounded-lg text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTag}
                  className="px-4 py-2 bg-surface-200 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-300 transition-colors"
                >
                  Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
