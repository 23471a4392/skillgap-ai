import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Compass, Menu, Shield, Sparkles, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition group-hover:bg-brand-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              SKILLGAP<span className="text-brand-600">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium -mt-1 hidden sm:inline">
              Career Readiness Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/features"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition"
          >
            How It Works
          </Link>
          <Link
            to="/careers"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition"
          >
            Career Roles
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition"
          >
            Philosophy
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
            >
              <User className="h-4 w-4" />
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button
                onClick={handleDemo}
                className="text-xs font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1.5 rounded-md hover:bg-brand-100 transition border border-brand-200 dark:border-brand-800"
              >
                ⚡ Explore Demo Account
              </button>
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition shadow-sm"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated && (
            <button
              onClick={handleDemo}
              className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1.5 rounded border border-brand-200"
            >
              Demo
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-3 dark:border-zinc-800 dark:bg-zinc-950">
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-700 dark:text-zinc-300"
          >
            How It Works
          </Link>
          <Link
            to="/careers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-700 dark:text-zinc-300"
          >
            Career Roles
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-700 dark:text-zinc-300"
          >
            Philosophy
          </Link>
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-lg border border-zinc-300 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white dark:bg-brand-600"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
