import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/questions', icon: BookOpen, label: 'Question Bank' },
  { to: '/app/assessments', icon: FileText, label: 'Assessments' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/certificates', icon: Award, label: 'Certificates' },
];

const bottomItems = [
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col h-full bg-surface-50 border-r border-surface-200/50 z-30"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-surface-200/50">
        <NavLink to="/app" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg text-surface-900 tracking-tight"
              >
                QuizForge
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-surface-100 border border-surface-200 text-surface-500 hover:text-surface-900 hover:bg-surface-200 transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative block"
            >
              <motion.div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative overflow-hidden',
                  isActive
                    ? 'text-primary-400'
                    : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
                )}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-500/10 border border-primary-500/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <item.icon className={cn('w-5 h-5 shrink-0 relative z-10', isActive && 'text-primary-400')} />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary-500 rounded-full"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="py-4 px-3 border-t border-surface-200/50 space-y-1">
        {/* AI Feature Promo */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 rounded-xl bg-gradient-to-br from-secondary-500/10 to-primary-500/10 border border-secondary-500/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-secondary-400" />
                <span className="text-xs font-semibold text-secondary-400">AI Powered</span>
              </div>
              <p className="text-xs text-surface-500">
                Generate quizzes from PDFs, videos, and more.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors'
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* User Avatar */}
        <div className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl mt-2 bg-surface-100/50',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            SC
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-sm font-medium text-surface-900 truncate">Sarah Chen</p>
                <p className="text-xs text-surface-500 truncate">Admin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
