import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  History,
  Plus,
  Search,
  Target,
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';

export const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.analysis.getHistory();
        setAnalyses(res.analyses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredAnalyses = analyses.filter(
    (a) =>
      a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Analysis History & Audit Log
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Review past job evaluations, inspect score progress, and compare requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 transition"
          >
            Compare Roles Side-by-Side
          </Link>
          <Link
            to="/job-analysis"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Analyze New Job
          </Link>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by company or role..."
          className="w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Analyses Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50 text-zinc-500">
                <th className="p-4 font-semibold">Role & Organization</th>
                <th className="p-4 font-semibold">Readiness Score</th>
                <th className="p-4 font-semibold">Status Verdict</th>
                <th className="p-4 font-semibold">Matched / Missing</th>
                <th className="p-4 font-semibold">Analysis Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredAnalyses.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => navigate(`/job-analysis/${a.id}`)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition"
                >
                  <td className="p-4">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{a.jobTitle}</div>
                    <div className="text-[11px] text-zinc-500">{a.company}</div>
                  </td>
                  <td className="p-4 font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                    {a.overallScore}%
                  </td>
                  <td className="p-4">
                    <Badge variant={a.overallScore >= 80 ? 'success' : a.overallScore >= 65 ? 'info' : 'warning'}>
                      {a.verdict}
                    </Badge>
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    <span className="text-emerald-600 font-semibold">{a.matchedSkills?.length || 0} Met</span> /{' '}
                    <span className="text-rose-600 font-semibold">{a.missingSkills?.length || 0} Gaps</span>
                  </td>
                  <td className="p-4 text-zinc-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                      View Diagnostics <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAnalyses.length === 0 && (
          <div className="text-center py-12 p-6 text-xs text-zinc-500">
            No analysis records found. Run your first job description analysis to build your history!
          </div>
        )}
      </div>
    </div>
  );
};
