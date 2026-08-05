import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, BookOpen, FileText, BarChart3,
  Award, Plus, Settings, ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/app/dashboard', group: 'Navigation' },
  { id: 'questions', label: 'Question Bank', icon: BookOpen, path: '/app/questions', group: 'Navigation' },
  { id: 'assessments', label: 'Assessments', icon: FileText, path: '/app/assessments', group: 'Navigation' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/app/analytics', group: 'Navigation' },
  { id: 'certificates', label: 'Certificates', icon: Award, path: '/app/certificates', group: 'Navigation' },
  { id: 'new-question', label: 'Create New Question', icon: Plus, path: '/app/questions/new', group: 'Actions' },
  { id: 'new-assessment', label: 'Create New Assessment', icon: Plus, path: '/app/assessments/new', group: 'Actions' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/app/settings', group: 'Other' },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = commands.filter(
    (cmd) => cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const groups = [...new Set(filtered.map((cmd) => cmd.group))];

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].path);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-surface-50 border border-surface-200/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200/50">
                <Search className="w-5 h-5 text-surface-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-surface-900 placeholder:text-surface-400 outline-none text-sm"
                />
                <kbd className="px-2 py-1 text-xs text-surface-400 bg-surface-200/50 rounded font-mono">Esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-surface-500 text-sm">
                    No results found for "{query}"
                  </div>
                ) : (
                  groups.map((group) => (
                    <div key={group}>
                      <div className="px-4 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                        {group}
                      </div>
                      {filtered
                        .filter((cmd) => cmd.group === group)
                        .map((cmd) => {
                          const index = filtered.indexOf(cmd);
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => {
                                navigate(cmd.path);
                                onClose();
                              }}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                index === selectedIndex
                                  ? 'bg-primary-500/10 text-primary-400'
                                  : 'text-surface-700 hover:bg-surface-100'
                              }`}
                            >
                              <cmd.icon className="w-4 h-4" />
                              <span className="flex-1 text-left">{cmd.label}</span>
                              {index === selectedIndex && (
                                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-surface-200/50 text-xs text-surface-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface-200/50 rounded font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface-200/50 rounded font-mono">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface-200/50 rounded font-mono">Esc</kbd> Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
