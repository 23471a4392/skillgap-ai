import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building,
  CheckCircle,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Badge } from '../components/common/Badge';

export const JobAnalysisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingApp, setSavingApp] = useState(false);
  const [appSaved, setAppSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await api.analysis.getById(id);
        setAnalysis(res.analysis);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleTrackApplication = async () => {
    if (!analysis) return;
    setSavingApp(true);
    try {
      await api.applications.create({
        company: analysis.company,
        jobTitle: analysis.jobTitle,
        location: analysis.location,
        status: 'wishlist',
        analysisId: analysis.id,
        matchScore: analysis.overallScore,
        notes: `Analyzed via SkillGap AI with ${analysis.overallScore}% readiness match.`,
      });
      setAppSaved(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-zinc-500">
        Loading diagnostic breakdown...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-sm text-zinc-600">Job analysis not found.</p>
        <Link to="/history" className="text-xs font-semibold text-brand-600 hover:underline">
          Return to Analysis History
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Analyses History
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-6 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {analysis.jobTitle}
              </h1>
              <Badge variant="info">{analysis.company}</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
              <span>{analysis.location || 'Remote'}</span> •
              <span>Evaluated on {new Date(analysis.createdAt).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ScoreGauge score={analysis.overallScore} size="md" showLabel={false} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Readiness Match
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {analysis.overallScore}%
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Potential: <strong className="text-brand-600">{analysis.potentialScore}%</strong> (+{analysis.potentialScore - analysis.overallScore}%)
              </p>
            </div>
          </div>
        </div>

        {/* Humanized Rationale Banner */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            <strong className="text-zinc-900 dark:text-zinc-100 block sm:inline">Verdict Rationale: </strong>
            {analysis.summaryReason}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleTrackApplication}
              disabled={savingApp || appSaved}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                appSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
              }`}
            >
              {appSaved ? '✓ Added to Job Tracker' : '+ Track Application'}
            </button>

            <Link
              to="/roadmap"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition"
            >
              <Compass className="h-3.5 w-3.5" />
              View Roadmap
            </Link>
          </div>
        </div>
      </div>

      {/* 5-Factor Score Radar / Component Breakdown */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Deterministic 5-Factor Weight Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500">Technical Skills ({analysis.weightsUsed?.technicalSkills || 50}%)</span>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {analysis.technicalScore}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500">Experience ({analysis.weightsUsed?.experience || 20}%)</span>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {analysis.experienceScore}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500">Projects ({analysis.weightsUsed?.projects || 10}%)</span>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {analysis.projectScore}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500">Education ({analysis.weightsUsed?.education || 10}%)</span>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {analysis.educationScore}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-zinc-500">Soft Skills ({analysis.weightsUsed?.softSkills || 10}%)</span>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {analysis.softSkillsScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Partial Gaps Explainability Section */}
      {analysis.partialGaps && analysis.partialGaps.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              Explainable Depth Gaps ({analysis.partialGaps.length})
            </h3>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-300/80">
            You know these technologies, but the role expects greater depth and architectural mastery:
          </p>

          <div className="space-y-3">
            {analysis.partialGaps.map((gap: any, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm dark:border-amber-900/60 dark:bg-zinc-900"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {gap.skillName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-zinc-500">Your Level:</span>
                    <Badge size="sm" variant="default">{gap.currentProficiency}</Badge>
                    <span className="text-zinc-400">→</span>
                    <span className="text-zinc-500">Required:</span>
                    <Badge size="sm" variant="info">{gap.targetProficiency}</Badge>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2.5 leading-relaxed">
                  {gap.humanExplanation}
                </p>

                {gap.actionableTopics && gap.actionableTopics.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      Actionable Focus Checklist:
                    </span>
                    <ul className="space-y-1">
                      {gap.actionableTopics.map((topic: string, tidx: number) => (
                        <li key={tidx} className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                          <span className="text-amber-500">•</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matched vs Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Matched Requirements ({analysis.matchedSkills.length})
            </h3>
            <Badge variant="success" size="sm">Passed Criteria</Badge>
          </div>

          <div className="space-y-2">
            {analysis.matchedSkills.map((s: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-800/30 text-xs"
              >
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{s.name}</span>
                  <div className="text-[11px] text-zinc-500">
                    {s.evidenceSource || 'Self-Reported Skill'}
                  </div>
                </div>
                <Badge size="sm" variant={s.isRequirementMet ? 'success' : 'warning'}>
                  {s.userProficiency}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              Missing Skills ({analysis.missingSkills.length})
            </h3>
            <Badge variant="danger" size="sm">Action Required</Badge>
          </div>

          <div className="space-y-2.5">
            {analysis.missingSkills.map((s: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{s.name}</span>
                  <Badge size="sm" variant="danger">{s.importance}</Badge>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Target Proficiency: {s.requiredProficiency} • Estimated Effort: ~{s.estimatedHoursToAcquire} hours
                </p>
                {s.recommendedResource && (
                  <a
                    href={s.recommendedResource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
                  >
                    Recommended: {s.recommendedResource.title} ↗
                  </a>
                )}
              </div>
            ))}

            {analysis.missingSkills.length === 0 && (
              <div className="text-center py-6 text-xs text-zinc-500">
                No missing technical skills detected!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Action Plan */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Prioritized Action Plan
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
          {analysis.recommendedActions?.map((action: string, i: number) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="font-bold text-brand-600 mt-0.5">{i + 1}.</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition"
          >
            Open Phased Roadmap for this Job
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
