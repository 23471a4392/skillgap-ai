import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, DollarSign, Layers, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Badge } from '../components/common/Badge';
import { CAREER_ROLES } from '@skillgap/config';

export const CareersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const departments = ['All', 'Engineering', 'Data & Analytics', 'AI & Data Science', 'Infrastructure', 'AI & Emerging Tech'];

  const filteredRoles = CAREER_ROLES.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase()) ||
      role.requiredSkills.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDepartment === 'All' || role.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      <section className="py-12 sm:py-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Market Role Benchmarks
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Curated Career Role Catalog
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Explore industry benchmark roles mapped with real-world requirements, skill weights, compensation ranges, and structured roadmaps.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="absolute left-3.5 top-5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by role title, skill (e.g. React, SQL, Docker)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>
      </section>

      {/* Department Filter & Roles List */}
      <section className="py-12 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Department pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  selectedDepartment === dept
                    ? 'bg-zinc-900 text-white dark:bg-brand-600'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Grid of Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between dark:border-zinc-800 dark:bg-zinc-900 transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {role.department}
                    </span>
                    <Badge variant={role.marketDemand === 'Very High' ? 'success' : 'info'} size="sm">
                      {role.marketDemand} Demand
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{role.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="space-y-2 py-3 border-y border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Benchmark Salary:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{role.averageSalaryUsd}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Min Experience:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {role.minExperienceYears === 0 ? 'Entry / Freshers Welcome' : `${role.minExperienceYears}+ Years`}
                      </span>
                    </div>
                  </div>

                  {/* Required skills preview */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Core Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {role.requiredSkills.slice(0, 4).map((s) => (
                        <span
                          key={s.name}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {s.name}
                        </span>
                      ))}
                      {role.requiredSkills.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          +{role.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    to="/job-analysis"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    Analyze Yourself for This Role →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-dashed border-zinc-300 p-8">
              <p className="text-sm text-zinc-500">No career roles found matching "{search}". Try searching for React, Python, or SQL.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
