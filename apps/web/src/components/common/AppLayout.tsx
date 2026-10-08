import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, Plus, Sparkles, Target, User } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { CAREER_ROLES } from '@skillgap/config';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();

  const targetRole = profile?.targetRoleId
    ? CAREER_ROLES.find((r) => r.id === profile.targetRoleId)?.title
    : 'Full Stack Developer';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Target Role indicator */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                <Target className="h-3.5 w-3.5 text-brand-600" />
                <span>Target: <strong>{targetRole}</strong></span>
              </span>
              <Link
                to="/profile"
                className="text-[11px] text-brand-600 hover:underline hidden md:inline"
              >
                Change
              </Link>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/job-analysis"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Analyze Job</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="View Profile"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white text-xs font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
