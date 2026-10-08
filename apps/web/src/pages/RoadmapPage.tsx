import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Layers,
  Sparkles,
  Target,
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.roadmap.getActive();
      setRoadmap(res.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
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

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-zinc-500">
        Loading personalized roadmap...
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-3">
        <Compass className="h-10 w-10 mx-auto text-zinc-400" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          No Active Roadmap Found
        </h2>
        <p className="text-xs text-zinc-500">
          Analyze a job description to automatically generate a phased, week-by-week learning plan tailored to your exact missing skills.
        </p>
        <div className="pt-2">
          <Link
            to="/job-analysis"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Run Job Analysis →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {roadmap.title}
            </h1>
            <Badge variant="info">Active Track</Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Targeting: <strong>{roadmap.targetRole}</strong> • {roadmap.totalWeeks} Weeks (~{roadmap.estimatedHours} Total Hours)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {roadmap.progressPercentage}% Complete
            </span>
            <div className="w-36 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 mt-1 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmap.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phased Milestones List */}
      <div className="space-y-6">
        {roadmap.milestones?.map((milestone: any, index: number) => {
          const completedCount = milestone.actionableTasks.filter((t: any) => t.completed).length;
          const totalTasks = milestone.actionableTasks.length;

          return (
            <div
              key={milestone.id || index}
              className={`rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 transition ${
                milestone.completed
                  ? 'border-emerald-200 dark:border-emerald-900/60'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm ${
                      milestone.completed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                    }`}
                  >
                    {milestone.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {milestone.phase}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-xs text-zinc-500">
                        {milestone.estimatedWeeks} {milestone.estimatedWeeks === 1 ? 'Week' : 'Weeks'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {milestone.title}
                    </h3>
                  </div>
                </div>

                <Badge
                  variant={milestone.completed ? 'success' : completedCount > 0 ? 'info' : 'default'}
                  size="sm"
                >
                  {milestone.completed
                    ? 'Phase Completed'
                    : `${completedCount} of ${totalTasks} Tasks Done`}
                </Badge>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                {milestone.description}
              </p>

              {/* Skills in focus */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-[11px] font-semibold text-zinc-400">Skills Focus:</span>
                <div className="flex flex-wrap gap-1">
                  {milestone.skillsFocus.map((s: string) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Tasks Checklist */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Action Items:
                </span>
                {milestone.actionableTasks.map((task: any) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(milestone.id, task.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer text-xs transition border ${
                      task.completed
                        ? 'bg-emerald-50/50 text-zinc-400 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 line-through'
                        : 'bg-zinc-50/60 text-zinc-800 border-zinc-200 hover:border-brand-300 dark:bg-zinc-800/40 dark:text-zinc-200 dark:border-zinc-700'
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

              {/* Free Curated Learning Resources */}
              {milestone.resources && milestone.resources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Curated Free Learning Resources:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {milestone.resources.map((res: any, rIndex: number) => (
                      <a
                        key={rIndex}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg border border-zinc-200 bg-zinc-50/40 hover:bg-brand-50 hover:border-brand-200 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300 transition"
                      >
                        <span className="truncate font-medium">{res.title}</span>
                        <ExternalLink className="h-3 w-3 text-zinc-400 flex-shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
