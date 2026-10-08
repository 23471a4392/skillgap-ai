import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Compass, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';

export const RoadmapDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.roadmap.getById(id);
        setRoadmap(res.roadmap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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
    return <div className="py-20 text-center text-xs text-zinc-500">Loading roadmap details...</div>;
  }

  if (!roadmap) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-sm text-zinc-600">Roadmap not found.</p>
        <Link to="/roadmap" className="text-xs font-semibold text-brand-600 hover:underline">
          Return to Active Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Roadmaps
        </Link>
      </div>

      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{roadmap.title}</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Role: <strong>{roadmap.targetRole}</strong> • {roadmap.totalWeeks} Weeks • {roadmap.progressPercentage}% Complete
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {roadmap.milestones?.map((milestone: any) => (
          <div key={milestone.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-brand-600">Phase {milestone.order}: {milestone.phase}</span>
              <Badge variant={milestone.completed ? 'success' : 'default'} size="sm">
                {milestone.estimatedWeeks} Weeks
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{milestone.title}</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{milestone.description}</p>

            <div className="space-y-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              {milestone.actionableTasks?.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(milestone.id, task.id)}
                  className={`flex items-start gap-2 p-2 rounded cursor-pointer text-xs border ${
                    task.completed ? 'bg-emerald-50 text-zinc-400 line-through border-emerald-200' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <input type="checkbox" checked={task.completed} onChange={() => {}} className="mt-0.5" />
                  <span>{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
