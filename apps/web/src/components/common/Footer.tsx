import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                SKILLGAP<span className="text-brand-600">AI</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              "Know where you stand. Know what to learn next."
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Deterministic, explainable skill diagnostics designed to replace resume guesswork with transparent engineering roadmaps.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Scoring Engine: Operational (v1.0)</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to="/features" className="hover:text-zinc-900 dark:hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Career Role Catalog
                </Link>
              </li>
              <li>
                <Link to="/job-analysis" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Job Description Analyzer
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Role Comparison Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
              Candidate Tools
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to="/skills" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Skill Inventory & Descriptors
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Personalized Roadmap
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Resume Entity Extractor
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Job Tracker Pipeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Ethics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
              Trust & Transparency
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
              Every percentage score is backed by deterministic criteria. We never sell student data or rely on hallucinated scores.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-brand-600 flex-shrink-0" />
              <span>Zero-vendor resume locking</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Full data export & deletion rights</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} SkillGap AI. Built with transparent engineering rigor.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link to="/about" className="hover:underline">
              Methodology
            </Link>
            <Link to="/settings" className="hover:underline">
              Data Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
