import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Command,
  Moon,
  Sun,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/mock-data';

interface HeaderProps {
  onCommandPalette: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onCommandPalette, sidebarCollapsed }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-surface-200/50 bg-surface-0/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Search */}
      <button
        onClick={onCommandPalette}
        className="flex items-center gap-3 px-4 py-2 bg-surface-100 hover:bg-surface-150 border border-surface-200/50 rounded-xl text-surface-500 hover:text-surface-700 transition-all group w-64"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search anything...</span>
        <div className="ml-auto flex items-center gap-1 text-xs text-surface-400">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-200/50 font-mono">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-200/50 font-mono">K</kbd>
        </div>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Quick Create */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-500 hover:text-surface-900 transition-colors"
        >
          <AnimatePresence mode="wait">
            {darkMode ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-500 hover:text-surface-900 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute right-0 top-12 w-80 bg-surface-50 border border-surface-200/50 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-surface-200/50">
                    <h3 className="font-semibold text-surface-900">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-surface-400 hover:text-surface-900">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notification, i) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          'p-4 border-b border-surface-200/30 hover:bg-surface-100/50 transition-colors cursor-pointer',
                          !notification.read && 'bg-primary-500/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-2 shrink-0',
                            notification.type === 'success' && 'bg-accent-500',
                            notification.type === 'info' && 'bg-primary-500',
                            notification.type === 'warning' && 'bg-warning-500',
                            notification.type === 'error' && 'bg-danger-500',
                          )} />
                          <div>
                            <p className="text-sm font-medium text-surface-900">{notification.title}</p>
                            <p className="text-xs text-surface-500 mt-0.5">{notification.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
