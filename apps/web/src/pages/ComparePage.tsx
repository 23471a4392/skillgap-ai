import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  CheckCircle2,
  Clock,
  GitCompare,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { ScoreGauge } from '../components/common/ScoreGauge';

export const ComparePage: React.FC = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.analysis.getHistory();
        const list = res.analyses || [];
        setAnalyses(list);

        // Pre-select first 2 analyses if available
        if (list.length >= 2) {
          const initial = [list[0].id, list[1].id];
          setSelectedIds(initial);
          runComparison(initial);
        } else if (list.length === 1) {
          setSelectedIds([list[0].id]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const runComparison = async (ids: string[]) => {
    if (ids.length < 2) return;
    setComparing(true);
    try {
      const res = await api.analysis.compare(ids);
      setComparisonResult(res.comparison);
    } catch (err: any) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    let next: string[];
    if (selectedIds.includes(id)) {
      next = selectedIds.filter((item) => item !== id);
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare a maximum of 3 jobs side-by-side.');
        return;
      }
      next = [...selectedIds, id];
    }
    setSelectedIds(next);
    if (next.length >= 2) {
      runComparison(next);
    } else {
      setComparisonResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Side-by-Side Job Comparison Matrix
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Compare multiple job postings against your profile to identify the optimal career path
        </p>
      </div>

      {/* Select Analyses to Compare */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Select 2 or 3 Previous Analyses to Compare:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {analyses.map((a) => {
            const isSelected = selectedIds.includes(a.id);
            return (
              <div
                key={a.id}
                onClick={() => handleToggleSelect(a.id)}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between text-xs ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:border-brand-600 dark:bg-brand-950/30'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-white dark:border-zinc-800 dark:bg-zinc-800/40'
                }`}
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{a.jobTitle}</div>
                  <div className="text-[11px] text-zinc-500">{a.company}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.overallScore >= 80 ? 'success' : a.overallScore >= 65 ? 'info' : 'warning'} size="sm">
                    {a.overallScore}%
                  </Badge>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded text-brand-600"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {analyses.length < 2 && (
          <div className="text-center py-4 text-xs text-zinc-500">
            You need at least 2 saved job analyses to run a comparison.{' '}
            <Link to="/job-analysis" className="text-brand-600 underline">
              Analyze a job description now
            </Link>
            .
          </div>
        )}
      </div>

      {/* Comparison Insights Banner */}
      {comparisonResult && (
        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900/60 dark:bg-brand-950/30 space-y-2">
          <div className="flex items-center gap-2 text-brand-900 dark:text-brand-200 font-bold text-xs">
            <Lightbulb className="h-4 w-4 text-brand-600" /> Strategic Recommendation
          </div>
          <p className="text-xs text-brand-900/90 dark:text-brand-200/90 leading-relaxed">
            {comparisonResult.recommendation}
          </p>
          {comparisonResult.sharedMissingSkills && comparisonResult.sharedMissingSkills.length > 0 && (
            <div className="pt-2 flex items-center gap-2 text-xs">
              <span className="font-semibold text-brand-900 dark:text-brand-200">High-Leverage Shared Gaps:</span>
              <div className="flex flex-wrap gap-1">
                {comparisonResult.sharedMissingSkills.map((s: string) => (
                  <Badge key={s} size="sm" variant="info">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Comparison Table */}
      {comparisonResult && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <th className="p-4 font-semibold text-zinc-500 w-1/4">Evaluation Metric</th>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <th key={a.id} className="p-4 font-bold text-zinc-900 dark:text-zinc-100">
                      <div>{a.jobTitle}</div>
                      <div className="text-[11px] font-normal text-zinc-500">{a.company}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {/* Row: Score */}
                <tr>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">
                    Readiness Score
                  </td>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <td key={a.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                          {a.overallScore}%
                        </span>
                        <Badge variant={a.overallScore >= 80 ? 'success' : a.overallScore >= 65 ? 'info' : 'warning'} size="sm">
                          {a.verdict}
                        </Badge>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row: Potential */}
                <tr>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">
                    Potential Readiness
                  </td>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <td key={a.id} className="p-4 font-bold text-brand-600 dark:text-brand-400">
                      {a.potentialScore}% (+{a.potentialScore - a.overallScore}%)
                    </td>
                  ))}
                </tr>

                {/* Row: Technical Skills */}
                <tr>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">
                    Technical Match
                  </td>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <td key={a.id} className="p-4 font-medium">
                      {a.technicalScore}%
                    </td>
                  ))}
                </tr>

                {/* Row: Missing Skills */}
                <tr>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">
                    Critical Missing Gaps
                  </td>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <td key={a.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {a.missingSkills.map((s: any) => (
                          <span
                            key={s.name}
                            className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
                          >
                            {s.name}
                          </span>
                        ))}
                        {a.missingSkills.length === 0 && <span className="text-zinc-400">None</span>}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row: Partial Gaps */}
                <tr>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">
                    Partial Depth Gaps
                  </td>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <td key={a.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {a.partialGaps.map((p: any) => (
                          <span
                            key={p.skillName}
                            className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                          >
                            {p.skillName} ({p.currentProficiency} → {p.targetProficiency})
                          </span>
                        ))}
                        {a.partialGaps.length === 0 && <span className="text-zinc-400">None</span>}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row: Action */}
                <tr>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">
                    Deep Diagnostics
                  </td>
                  {comparisonResult.jobAnalyses.map((a: any) => (
                    <td key={a.id} className="p-4">
                      <Link
                        to={`/job-analysis/${a.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline text-xs"
                      >
                        Inspect Breakdown →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
