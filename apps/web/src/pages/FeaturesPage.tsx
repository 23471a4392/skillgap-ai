import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Compass,
  FileText,
  GitCompare,
  Layers,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

export const FeaturesPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Target,
      title: 'Deterministic Job-Readiness Scoring',
      tagline: 'Zero hallucinated percentages. Real mathematical grading.',
      description:
        'Our algorithm evaluates your skills against job requirements with weighted categories: Technical Skills (45-50%), Experience (15-20%), Education (10%), Soft Skills (10%), and Projects (10-15%). Every score provides a human explanation.',
    },
    {
      icon: Search,
      title: 'Explainable Partial Depth Diagnostics',
      tagline: 'Knowing you know "some SQL" is not enough.',
      description:
        'When you have Intermediate SQL and the role expects Advanced SQL, SkillGap AI does not mark it as a binary failure. It calculates partial depth credit and specifies exact concepts required: query planning, indexing, CTEs, and ACID transactions.',
    },
    {
      icon: Compass,
      title: 'Automated 12-Week Roadmap Generation',
      tagline: 'From diagnosis directly into disciplined action.',
      description:
        'Each analysis instantly generates a structured, phased roadmap (Foundation Gaps -> Core Competencies -> Capstone Project -> Interview Drills) linked directly to free, battle-tested learning resources and documentation.',
    },
    {
      icon: GitCompare,
      title: 'Multi-Role Comparison Matrix',
      tagline: 'Compare 2 or 3 job offers or descriptions side-by-side.',
      description:
        'Confused between two roles? Select them in our comparison tool to visualize which job offers the highest immediate match, which requires the least effort to close gaps, and which shared skills advance your career across both.',
    },
    {
      icon: FileText,
      title: 'Resume Entity Extractor',
      tagline: 'Skip manual data entry with instant parsing.',
      description:
        'Paste your resume text to extract education degrees, graduation years, GitHub/LinkedIn links, and technical skills against our 100+ master catalog, with 1-click sync to your profile.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Velocity & Retest Engine',
      tagline: 'Log hours, build features, and re-verify your readiness.',
      description:
        'Track your weekly study streak and log course completions or project builds. Hit "Retest Readiness" to simulate updated scores and document your trajectory over time.',
    },
    {
      icon: Briefcase,
      title: 'Job Application Pipeline Tracker',
      tagline: 'Keep all job hunts organized in one unified pipeline.',
      description:
        'Track roles from Wishlist to Applied, Screening, Technical Interview, and Offer, automatically attaching your SkillGap readiness scores and interview notes.',
    },
    {
      icon: Shield,
      title: 'Privacy & Data Sovereignty',
      tagline: 'Your career data belongs solely to you.',
      description:
        'We never sell your resume to spam recruiters or data vendors. Download your full data JSON or delete your account at any time with complete cascading cleanup.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      <section className="py-16 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Platform Capabilities
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Engineered for Transparency. Built for Career Progression.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Explore the core architectural systems that power SkillGap AI's deterministic diagnostics and personalized roadmaps.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{feat.title}</h3>
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">{feat.tagline}</p>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleDemo}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition"
            >
              Test These Features Live with Demo Data
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
