import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  Plus,
  RotateCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ProgressPage: React.FC = () => {
  const [summary, setSummary] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Log Modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activityType, setActivityType] = useState('course_completed');
  const [completedItem, setCompletedItem] = useState('');
  const [hoursSpent, setHoursSpent] = useState(2.0);
  const [description, setDescription] = useState('');
  const [skillName, setSkillName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Retest state
  const [retesting, setRetesting] = useState(false);
  const [retestMessage, setRetestMessage] = useState('');

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.progress.getOverview();
      setSummary(res.summary);
      setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.progress.logActivity({
        activityType,
        completedItem,
        hoursSpent: Number(hoursSpent),
        description,
        skillName: skillName || undefined,
      });
      await fetchProgress();
      setLogModalOpen(false);
      setCompletedItem('');
      setDescription('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetest = async () => {
    setRetesting(true);
    setRetestMessage('');
    try {
      const res = await api.progress.retest();
      setRetestMessage(res.message);
      await fetchProgress();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRetesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Learning Progress & Velocity Tracker
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Log intentional study hours, track project builds, and re-test readiness
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRetest}
            disabled={retesting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 transition"
          >
            <RotateCw className={`h-3.5 w-3.5 ${retesting ? 'animate-spin' : ''}`} />
            {retesting ? 'Re-evaluating...' : 'Retest Skill Readiness'}
          </button>

          <button
            onClick={() => setLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Log Study Hours
          </button>
        </div>
      </div>

      {retestMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{retestMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Hours Invested</span>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            {summary?.totalHours || 0} Hours
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Across {logs.length} logged milestones</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Weekly Streak</span>
          <div className="flex items-center gap-1.5 text-2xl font-extrabold text-amber-600 mt-1">
            <Flame className="h-6 w-6 fill-amber-500" />
            <span>{summary?.streakDays || 4} Days</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Consistent daily practice</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Current Job Readiness</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {summary?.currentReadinessScore || 80}%
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Evaluated against target benchmark</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Potential Target</span>
          <div className="text-2xl font-extrabold text-brand-600 mt-1">
            {summary?.potentialScore || 92}%
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">When top 3 gaps are addressed</p>
        </div>
      </div>

      {/* Activity Logs Timeline */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          Logged Learning Activities ({logs.length})
        </h3>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between p-4 rounded-lg border border-zinc-100 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-800/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {log.activityType.replace('_', ' ')}
                  </span>
                  <Badge size="sm" variant={log.activityType === 'assessment' ? 'info' : 'success'}>
                    +{log.hoursSpent}h
                  </Badge>
                  {log.scoreDelta && (
                    <span className="text-[11px] font-bold text-emerald-600">
                      +{log.scoreDelta}% Readiness
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {log.completedItem}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {log.description}
                </p>
              </div>

              <span className="text-[11px] text-zinc-400 flex-shrink-0 ml-4">
                {new Date(log.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-10 text-xs text-zinc-500">
              No learning activities logged yet. Click "+ Log Study Hours" to begin tracking.
            </div>
          )}
        </div>
      </div>

      {/* Log Activity Modal */}
      <Modal isOpen={logModalOpen} onClose={() => setLogModalOpen(false)} title="Log Intentional Study Hours">
        <form onSubmit={handleLogActivity} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="course_completed">Course / Tutorial Completed</option>
              <option value="project_built">Portfolio Feature / Project Built</option>
              <option value="skill_practiced">Hands-on Skill Practice & Exercises</option>
              <option value="roadmap_milestone">Roadmap Phase Task Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Title / Resource Name
            </label>
            <input
              type="text"
              required
              value={completedItem}
              onChange={(e) => setCompletedItem(e.target.value)}
              placeholder="e.g. Docker Multi-Stage Builds Workshop"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Hours Dedicated
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                required
                value={hoursSpent}
                onChange={(e) => setHoursSpent(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Associated Skill
              </label>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Docker, PostgreSQL"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              What did you learn or construct?
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of concepts grasped or code written..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setLogModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              {submitting ? 'Logging...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
