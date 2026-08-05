import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft, Save, Settings, Plus, GripVertical,
  Trash2, Clock, Hash, Eye, Send, ChevronDown,
  ChevronUp, FileText, Shuffle, Shield, Award,
  Lock, RotateCcw, Monitor, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockQuestions } from '@/lib/mock-data';

export function AssessmentBuilderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'builder' | 'settings'>('builder');
  const [sections, setSections] = useState([
    { id: '1', title: 'Section 1', questions: mockQuestions.slice(0, 3), collapsed: false },
  ]);

  // Settings state
  const [timeLimit, setTimeLimit] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [passingScore, setPassingScore] = useState(70);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [requireFullscreen, setRequireFullscreen] = useState(false);
  const [allowBacktracking, setAllowBacktracking] = useState(true);
  const [certificateEnabled, setCertificateEnabled] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState(false);

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const totalPoints = sections.reduce((sum, s) => sum + s.questions.reduce((qs, q) => qs + q.points, 0), 0);

  const addSection = () => {
    setSections([...sections, { id: String(sections.length + 1), title: `Section ${sections.length + 1}`, questions: [], collapsed: false }]);
  };

  const handlePublish = () => {
    toast.success('Assessment published!', { description: 'Your assessment is now available to students.' });
    navigate('/app/assessments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/app/assessments')}
            className="p-2 rounded-xl bg-surface-50 border border-surface-200/50 text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-surface-900">Assessment Builder</h1>
            <p className="text-xs text-surface-500 mt-0.5">{totalQuestions} questions · {totalPoints} points</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-500 hover:text-surface-900 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-500 hover:text-surface-900 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-accent-500/20"
          >
            <Send className="w-4 h-4" />
            Publish
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-50 border border-surface-200/50 rounded-xl w-fit">
        {(['builder', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'relative px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              activeTab === tab ? 'text-primary-400' : 'text-surface-500 hover:text-surface-900'
            )}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="builder-tab"
                className="absolute inset-0 bg-primary-500/10 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {tab === 'builder' ? <FileText className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              {tab}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'builder' ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Assessment Info */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assessment Title"
                className="w-full text-xl font-bold bg-transparent text-surface-900 placeholder:text-surface-300 outline-none"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={2}
                className="w-full text-sm bg-transparent text-surface-500 placeholder:text-surface-300 outline-none resize-none"
              />
            </div>

            {/* Sections */}
            {sections.map((section, si) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-surface-50 border border-surface-200/50 overflow-hidden"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/30">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-surface-300 cursor-grab" />
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[si].title = e.target.value;
                        setSections(newSections);
                      }}
                      className="font-semibold text-surface-900 bg-transparent outline-none text-sm"
                    />
                    <span className="text-xs text-surface-400">
                      {section.questions.length} questions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newSections = [...sections];
                        newSections[si].collapsed = !newSections[si].collapsed;
                        setSections(newSections);
                      }}
                      className="p-1 text-surface-400 hover:text-surface-900 transition-colors"
                    >
                      {section.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <button className="p-1 text-surface-400 hover:text-danger-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Questions */}
                <AnimatePresence>
                  {!section.collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-2">
                        {section.questions.map((question, qi) => (
                          <motion.div
                            key={question.id}
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-surface-100/50 hover:bg-surface-100 transition-colors group"
                          >
                            <GripVertical className="w-4 h-4 text-surface-300 cursor-grab shrink-0" />
                            <div className="w-7 h-7 rounded-lg bg-surface-200/50 flex items-center justify-center text-xs font-mono text-surface-500 shrink-0">
                              {qi + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-surface-900 truncate">{question.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-surface-400">{question.type.replace('_', ' ')}</span>
                                <span className="text-[10px] text-surface-300">·</span>
                                <span className="text-[10px] text-surface-400">{question.points} pts</span>
                              </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 p-1 text-surface-400 hover:text-danger-400 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="flex items-center gap-2 w-full p-3 border border-dashed border-surface-300 rounded-xl text-sm text-surface-500 hover:text-surface-900 hover:border-surface-400 transition-colors justify-center"
                        >
                          <Plus className="w-4 h-4" />
                          Add Question
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Add Section */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={addSection}
              className="flex items-center gap-2 w-full p-4 border border-dashed border-surface-300 rounded-2xl text-sm text-surface-500 hover:text-surface-900 hover:border-surface-400 transition-colors justify-center"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Time & Attempts */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50 space-y-4">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                Time & Attempts
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-surface-500 mb-1 block">Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-100 border border-surface-200/50 rounded-lg text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-surface-500 mb-1 block">Max Attempts</label>
                  <input
                    type="number"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-100 border border-surface-200/50 rounded-lg text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-surface-500 mb-1 block">Passing Score (%)</label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-100 border border-surface-200/50 rounded-lg text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50 space-y-4">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-secondary-400" />
                Behavior
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Shuffle Questions', icon: Shuffle, value: shuffleQuestions, setter: setShuffleQuestions },
                  { label: 'Shuffle Options', icon: Shuffle, value: shuffleOptions, setter: setShuffleOptions },
                  { label: 'Show Results', icon: Eye, value: showResults, setter: setShowResults },
                  { label: 'Allow Backtracking', icon: RotateCcw, value: allowBacktracking, setter: setAllowBacktracking },
                  { label: 'Negative Marking', icon: Hash, value: negativeMarking, setter: setNegativeMarking },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm text-surface-700 flex items-center gap-2">
                      <setting.icon className="w-3.5 h-3.5 text-surface-400" />
                      {setting.label}
                    </span>
                    <button
                      onClick={() => setting.setter(!setting.value)}
                      className={cn(
                        'relative w-10 h-6 rounded-full transition-colors',
                        setting.value ? 'bg-primary-500' : 'bg-surface-300'
                      )}
                    >
                      <motion.div
                        animate={{ x: setting.value ? 18 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50 space-y-4">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-danger-400" />
                Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-700 flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-surface-400" />
                    Require Fullscreen
                  </span>
                  <button
                    onClick={() => setRequireFullscreen(!requireFullscreen)}
                    className={cn('relative w-10 h-6 rounded-full transition-colors', requireFullscreen ? 'bg-primary-500' : 'bg-surface-300')}
                  >
                    <motion.div
                      animate={{ x: requireFullscreen ? 18 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200/50 space-y-4">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-warning-400" />
                Extras
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Enable Certificates', value: certificateEnabled, setter: setCertificateEnabled },
                  { label: 'Show Leaderboard', value: showLeaderboard, setter: setShowLeaderboard },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm text-surface-700">{setting.label}</span>
                    <button
                      onClick={() => setting.setter(!setting.value)}
                      className={cn('relative w-10 h-6 rounded-full transition-colors', setting.value ? 'bg-primary-500' : 'bg-surface-300')}
                    >
                      <motion.div
                        animate={{ x: setting.value ? 18 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
