import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { CAREER_ROLES, SAMPLE_BENCHMARK_JOBS } from '@skillgap/config';

export const JobAnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote');
  const [rawJobDescription, setRawJobDescription] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('role-fullstack');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleLoadSample = (sample: (typeof SAMPLE_BENCHMARK_JOBS)[0]) => {
    setJobTitle(sample.jobTitle);
    setCompany(sample.company);
    setLocation(sample.location);
    setRawJobDescription(sample.description);
    setTargetRoleId(sample.targetRoleId);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rawJobDescription.length < 40) {
      setError('Job description text should be at least 40 characters for accurate diagnostics.');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.analysis.analyze({
        jobTitle,
        company,
        location,
        rawJobDescription,
        targetRoleId,
      });

      navigate(`/job-analysis/${res.analysis.id}`);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please verify inputs.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Job Description Analyzer
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Paste any live job posting to calculate your readiness score and identify prioritized skill gaps
        </p>
      </div>

      {/* Benchmark Presets Bar */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Or Load Real-World Benchmark Job Descriptions:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_BENCHMARK_JOBS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-50 hover:bg-brand-50 hover:text-brand-700 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 transition"
            >
              <Zap className="h-3 w-3 text-amber-500" />
              {sample.company} — {sample.jobTitle}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analyzer Form */}
      <form onSubmit={handleAnalyze} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Job Title
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer - Full Stack"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Meta, Netflix"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Target Track Benchmark
            </label>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {CAREER_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Raw Job Description Text
            </label>
            <span className="text-[11px] text-zinc-400">
              {rawJobDescription.length} characters
            </span>
          </div>
          <textarea
            rows={12}
            required
            value={rawJobDescription}
            onChange={(e) => setRawJobDescription(e.target.value)}
            placeholder="Paste the complete job description from LinkedIn, Indeed, Greenhouse, Lever, or company careers page..."
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-xs font-mono text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[11px] text-zinc-500">
            Analysis is computed instantly using deterministic entity weighting.
          </p>
          <button
            type="submit"
            disabled={analyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition disabled:opacity-50"
          >
            {analyzing ? 'Analyzing Requirements...' : 'Run Skill Gap Analysis'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
