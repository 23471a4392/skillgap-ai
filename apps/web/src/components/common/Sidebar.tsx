import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Briefcase,
  Compass,
  FileText,
  FolderKanban,
  GitCompare,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  QrCode,
  Search,
  Settings,
  Target,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Skill Inventory', path: '/skills', icon: Layers },
    { label: 'Resume Parser', path: '/resume', icon: FileText },
    { label: 'QR Mobile Quick-Fill', path: '/quick-fill', icon: QrCode },
    { label: 'Job Analysis', path: '/job-analysis', icon: Target },
    { label: 'Role Compare', path: '/compare', icon: GitCompare },
    { label: 'Personal Roadmap', path: '/roadmap', icon: Compass },
    { label: 'Progress & Velocity', path: '/progress', icon: TrendingUp },
    { label: 'Portfolio Projects', path: '/projects', icon: FolderKanban },
    { label: 'Certifications', path: '/certifications', icon: Award },
    { label: 'Job Tracker', path: '/applications', icon: Briefcase },
    { label: 'Analysis History', path: '/history', icon: History },
    { label: 'Account Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 ${
          isOpen ? 'tranzinc-x-0' : '-tranzinc-x-full lg:tranzinc-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-200 dark:border-zinc-800">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              SKILLGAP<span className="text-brand-600">AI</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/60 dark:text-brand-300'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 ${
                    active ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex items-center justify-between rounded-lg p-2 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {user?.name || 'User'}
                </p>
                <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
