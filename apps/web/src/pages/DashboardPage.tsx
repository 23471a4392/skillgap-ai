import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  Layers,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CAREER_ROLES } from '@skillgap/config';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [progressSummary, setProgressSummary] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  const targetRole = profile?.targetRoleId
    ? CAREER_ROLES.find((r) => r.id === profile.targetRoleId)
    : CAREER_ROLES[0];

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [historyRes, roadmapRes, progressRes, appsRes] = await Promise.all([
        api.analysis.getHistory(),
        api.roadmap.getActive(),
        api.progress.getOverview(),
        api.applications.getAll(),
      ]);

      setAnalyses(historyRes.analyses || []);
      setRoadmap(roadmapRes.roadmap || null);
      setProgressSummary(progressRes.summary || null);
      setApplications(appsRes.applications || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleTask = async (milestoneId: string, taskId: string) => {
    if (!roadmap) return;
    try {
      const res = await api.roadmap.toggleTask(roadmap.id, milestoneId, taskId);
      setRoadmap(res.roadmap);
    } catch (err) {
      console.error(err);
    }
  };

  const latestAnalysis = analyses[0];
  const readinessScore = latestAnalysis ? latestAnalysis.overallScore : 75;
  const potentialScore = latestAnalysis ? latestAnalysis.potentialScore : 90;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {profile?.headline || 'Aspiring Professional'} • Targeting{' '}
            <strong className="text-zinc-800 dark:text-zinc-200">{targetRole?.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/job-analysis"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Analyze New Job
          </Link>
          <Link
            to="/progress"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 transition"
          >
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            Log Hours
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Job Readiness Gauge */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Readiness Score
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {readinessScore}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Potential: <strong className="text-brand-600">{potentialScore}%</strong> (+{potentialScore - readinessScore}%)
            </p>
          </div>
          <ScoreGauge score={readinessScore} size="sm" showLabel={false} />
        </div>

        {/* Card 2: Target Role */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Target Benchmark
            </span>
            <Badge variant="info" size="sm">
              {targetRole?.marketDemand || 'High'} Demand
            </Badge>
          </div>
          <div className="my-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {targetRole?.title}
            </h4>
            <p className="text-xs text-zinc-500">{targetRole?.averageSalaryUsd}</p>
          </div>
          <Link to="/careers" className="text-[11px] text-brand-600 hover:underline">
            View Role Requirements →
          </Link>
        </div>

        {/* Card 3: Learning Velocity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Learning Velocity
            </span>
            <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              <span>{progressSummary?.streakDays || 4}d Streak</span>
            </div>
          </div>
          <div className="my-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {progressSummary?.totalHours || 13.5}h
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              {progressSummary?.activitiesCount || 2} logged milestone activities
            </p>
          </div>
          <Link to="/progress" className="text-[11px] text-brand-600 hover:underline">
            View Velocity Log →
          </Link>
        </div>

        {/* Card 4: Application Pipeline */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Active Pipeline
            </span>
            <Briefcase className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="my-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {applications.length} Roles
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              {applications.filter((a) => a.status === 'screening' || a.status === 'technical').length} in active interviews
            </p>
          </div>
          <Link to="/applications" className="text-[11px] text-brand-600 hover:underline">
            Manage Tracker Kanban →
          </Link>
        </div>
      </div>

      {/* Main Grid: Roadmap & Critical Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Learning Roadmap */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-brand-600" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {roadmap?.title || 'Personalized Gap-Closing Roadmap'}
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Targeting: {roadmap?.targetRole || targetRole?.title} • {roadmap?.totalWeeks || 9} weeks ({roadmap?.estimatedHours || 100} hours total)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {roadmap?.progressPercentage || 15}% Complete
              </span>
              <div className="w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${roadmap?.progressPercentage || 15}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Milestone Display */}
          {roadmap?.milestones && roadmap.milestones.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                      Phase {roadmap.milestones[0].order}: {roadmap.milestones[0].phase}
                    </span>
                    <Badge size="sm" variant={roadmap.milestones[0].completed ? 'success' : 'default'}>
                      {roadmap.milestones[0].estimatedWeeks} Weeks Est.
                    </Badge>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {roadmap.milestones[0].title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                  {roadmap.milestones[0].description}
                </p>

                {/* Actionable Tasks Checklist */}
                <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Actionable Milestone Checklist:
                  </span>
                  {roadmap.milestones[0].actionableTasks.map((task: any) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(roadmap.milestones[0].id, task.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition border ${
                        task.completed
                          ? 'bg-emerald-50/50 text-zinc-500 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 line-through'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-brand-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span className="flex-1">{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  to="/roadmap"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View All {roadmap.milestones.length} Roadmap Phases & Free Resources →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-zinc-500">
              No active roadmap generated yet.{' '}
              <Link to="/job-analysis" className="text-brand-600 underline">
                Analyze a job
              </Link>{' '}
              to generate your personalized plan.
            </div>
          )}
        </div>

        {/* Right Col: Top Critical Skill Gaps */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Top Priority Gaps
              </h3>
            </div>
            <Link to="/skills" className="text-[11px] text-brand-600 hover:underline">
              Inventory
            </Link>
          </div>

          <p className="text-xs text-zinc-500">
            Closing these high-leverage areas will yield the greatest readiness score jump:
          </p>

          <div className="space-y-3">
            {latestAnalysis?.missingSkills && latestAnalysis.missingSkills.length > 0 ? (
              latestAnalysis.missingSkills.slice(0, 3).map((s: any) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{s.name}</span>
                    <Badge size="sm" variant="danger">Missing</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Requires ~{s.estimatedHoursToAcquire}h • Target level: {s.requiredProficiency}
                  </p>
                  {s.recommendedResource && (
                    <a
                      href={s.recommendedResource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
                    >
                      {s.recommendedResource.title} ↗
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-zinc-500">
                All core requirements currently met! Analyze another role to test your readiness.
              </div>
            )}

            {/* Depth Gap Highlight */}
            {latestAnalysis?.partialGaps && latestAnalysis.partialGaps.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Depth: {latestAnalysis.partialGaps[0].skillName}
                  </span>
                  <Badge size="sm" variant="warning">
                    {latestAnalysis.partialGaps[0].currentProficiency} → {latestAnalysis.partialGaps[0].targetProficiency}
                  </Badge>
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                  {latestAnalysis.partialGaps[0].humanExplanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Analyses and Tracker Quick Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Analyses */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Recent Job Analyses
            </h3>
            <Link to="/history" className="text-xs text-brand-600 hover:underline">
              View History ({analyses.length})
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {analyses.slice(0, 4).map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => navigate(`/job-analysis/${analysis.id}`)}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition"
              >
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {analysis.jobTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    {analysis.company} • {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={analysis.overallScore >= 80 ? 'success' : analysis.overallScore >= 65 ? 'info' : 'warning'}>
                    {analysis.overallScore}% Match
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Applications Tracker Quick View */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Application Pipeline Summary
            </h3>
            <Link to="/applications" className="text-xs text-brand-600 hover:underline">
              Open Board
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center py-1">
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Wishlist</span>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {applications.filter((a) => a.status === 'wishlist').length}
              </div>
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Applied</span>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {applications.filter((a) => a.status === 'applied').length}
              </div>
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Interview</span>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                {applications.filter((a) => a.status === 'screening' || a.status === 'technical').length}
              </div>
            </div>
            <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Offers</span>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                {applications.filter((a) => a.status === 'offer').length}
              </div>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 pt-1">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {app.jobTitle}
                  </div>
                  <div className="text-[11px] text-zinc-500">{app.company}</div>
                </div>
                <Badge
                  variant={
                    app.status === 'offer'
                      ? 'success'
                      : app.status === 'screening' || app.status === 'technical'
                      ? 'info'
                      : 'default'
                  }
                  size="sm"
                >
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
