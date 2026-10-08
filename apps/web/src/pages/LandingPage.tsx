import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Flame,
  Layers,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { CAREER_ROLES } from '@skillgap/config';

export const LandingPage: React.FC = () => {
  const { demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  const handleDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const faqs = [
    {
      q: 'How does the Skill Gap Algorithm work without hallucinating?',
      a: 'Unlike generic LLM wrappers that output random scores, SkillGap AI uses a deterministic scoring engine. We parse required and preferred technologies, check against your verified projects and self-rated proficiency, and evaluate depth gaps mathematically. For example, if a job requires Advanced SQL and you have Intermediate SQL, we assign a 75% depth score and generate a human explanation outlining the exact topics (CTEs, window functions, query plans) you need to bridge.',
    },
    {
      q: 'Is this suitable for freshers and college students with zero formal experience?',
      a: 'Yes, absolutely. Our scoring engine calibrates role weights appropriately. For entry-level positions, our algorithm weights hands-on portfolio projects and technical fundamentals over years of experience, and gives credit for verified coursework and internship projects.',
    },
    {
      q: 'Can I paste any custom job description from LinkedIn, Indeed, or company career pages?',
      a: 'Yes. Simply copy and paste the raw text of any job posting into the Job Analyzer. Our entity extractor identifies required skills, preferred frameworks, experience requirements, and education prerequisites in seconds.',
    },
    {
      q: 'Can I upload or paste my existing resume?',
      a: 'Yes. The Resume Parser extracts your technical skills, education degrees, graduation year, and work history, and allows you to apply them directly to your SkillGap profile with one click.',
    },
    {
      q: 'What is the "Potential Readiness Score"?',
      a: 'Potential Readiness calculates what your score will increase to once you complete the top 2-3 missing skills or partial gaps identified in your personalized roadmap. This gives you a clear target and measurable milestone.',
    },
    {
      q: 'Are the learning resources free?',
      a: 'Our generated roadmaps prioritize battle-tested, high-quality, free resources: official documentation, open-source guides (e.g. System Design Primer, Full Stack Open), and interactive tutorials.',
    },
    {
      q: 'How is my private data handled?',
      a: 'We never sell your resume or personal details to third-party recruiters or ad brokers. You have complete rights to export your entire dataset as JSON or permanently delete your account at any time from your settings.',
    },
    {
      q: 'Can I track multiple job applications simultaneously?',
      a: 'Yes! The platform includes a dedicated Job Application Tracker with a full pipeline view (Wishlist, Applied, Screening, Technical Interview, Offer) and automatically links your match score to each application.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 via-transparent to-transparent dark:from-brand-950/20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse"></span>
              Humanized Engineering Career Engine
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.15]">
              Know where you stand.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-fuchsia-600">
                Know what to learn next.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              SkillGap AI analyzes your current skills against real-world job descriptions. We calculate your deterministic readiness score, highlight exact technical gaps, and generate a customized week-by-week learning roadmap.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                >
                  Return to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition"
                  >
                    Build Your Profile Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={handleDemo}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3.5 text-base font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
                  >
                    ⚡ Explore Demo Profile
                  </button>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 mt-8">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Deterministic Scoring Engine</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>15+ Curated Tech Roles</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Actionable 12-Week Roadmaps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              The Fundamental Problem
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              The "Submit and Pray" Trap is Costing You Months
            </h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Students and engineers send hundreds of applications into black holes without knowing why they are rejected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Old Way */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-6 dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>The Traditional Blind Approach</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Applying to 100+ generic roles without knowing which technical requirements you actually meet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Wasting 40 hours learning random tutorials that have zero bearing on your target role's expectations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Vague rejection emails with zero actionable feedback on your missing skills.</span>
                </li>
              </ul>
            </div>

            {/* The SkillGap AI Way */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>The SkillGap AI Approach</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Transparent job-readiness score calculated from technical skills, projects, and education.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Diagnostic breakdown explaining partial gaps: e.g. Intermediate SQL vs Advanced SQL requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Turnkey milestone roadmap with free, curated documentation, projects, and interview drills.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Example Skill-Gap Analysis Preview Section */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              Explainable Diagnostics
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Real Analysis Example: Stripe Full-Stack Role
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Here is how SkillGap AI evaluates Alex Morgan's profile against an actual Stripe job description.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Software Engineer - Full Stack
                  </h4>
                  <Badge variant="info">Stripe</Badge>
                </div>
                <p className="text-xs text-zinc-500 mt-1">San Francisco, CA / Remote • Evaluated via Deterministic Engine</p>
              </div>

              <div className="flex items-center gap-4">
                <ScoreGauge score={80} size="sm" showLabel={false} />
                <div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">80% Job Readiness</div>
                  <div className="text-xs text-zinc-500">Potential: <strong className="text-brand-600">92%</strong> (+12%)</div>
                </div>
              </div>
            </div>

            {/* Score Breakdown Radar/Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-6 border-b border-zinc-200 dark:border-zinc-800 text-center">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xs text-zinc-500">Technical (50%)</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">78%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xs text-zinc-500">Experience (20%)</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">85%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xs text-zinc-500">Projects (10%)</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">85%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xs text-zinc-500">Education (10%)</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">95%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 col-span-2 sm:col-span-1">
                <div className="text-xs text-zinc-500">Soft Skills (10%)</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">90%</div>
              </div>
            </div>

            {/* Explainable Gap Note */}
            <div className="py-6 space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Diagnostic Explainability Sample</h5>
              
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Partial Depth Gap: PostgreSQL & SQL
                  </span>
                  <Badge variant="warning" size="sm">Your Level: Elementary | Expected: Intermediate</Badge>
                </div>
                <p className="mt-2 text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                  "Your SQL foundation matches basic queries and migrations, but this Stripe role expects indexing strategies, ACID transaction locks, and query plan optimization (EXPLAIN ANALYZE). Focus on window functions, CTEs, and connection pooling."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-zinc-200 p-3 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" /> Matched Skills (6)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Git'].map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[11px] rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 p-3 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing Skills (2)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Docker Containerization', 'Automated Integration Testing'].map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[11px] rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleDemo}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View Full Detailed Breakdown in Demo Account →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How SkillGap Works */}
      <section className="py-16 bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              Three-Step System
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              How SkillGap AI Closes the Career Loop
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                1. Build or Import Profile
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Add your technical proficiencies, education, completed internships, and portfolio projects. Or paste your raw resume text to auto-extract your credentials in one click.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                2. Run Deterministic Analysis
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Paste any live job description or choose a curated benchmark. Our algorithm extracts requirements, tests proficiency depth, and outputs an explainable readiness percentage.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                3. Execute Phased Roadmap
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Receive a 12-week roadmap tailored directly to your gaps. Complete actionable modules, log learning hours, and re-test your readiness as your score advances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Roles Catalog Preview */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-1">
                Role Benchmarks
              </h2>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                15+ Mapped Technology Roles
              </h3>
            </div>
            <Link
              to="/careers"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
            >
              Explore Full Career Catalog ({CAREER_ROLES.length} roles) →
            </Link>
          </div>

          {/* Role selector tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {CAREER_ROLES.map((role, idx) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                  selectedRoleIndex === idx
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {role.title}
              </button>
            ))}
          </div>

          {/* Active Role Card */}
          {CAREER_ROLES[selectedRoleIndex] && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5 dark:border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {CAREER_ROLES[selectedRoleIndex].title}
                    </h4>
                    <Badge variant="success">{CAREER_ROLES[selectedRoleIndex].marketDemand} Demand</Badge>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
                    {CAREER_ROLES[selectedRoleIndex].description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-500">Benchmark Compensation</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {CAREER_ROLES[selectedRoleIndex].averageSalaryUsd}
                  </div>
                </div>
              </div>

              <div className="pt-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Core Required Skills</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CAREER_ROLES[selectedRoleIndex].requiredSkills.map((s) => (
                    <div
                      key={s.name}
                      className="rounded-lg border border-zinc-100 p-3 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-800/40"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{s.name}</span>
                        <Badge size="sm" variant="default">{s.minProficiency}</Badge>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-tight">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Clear Answers on Our Technology & Ethics
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  >
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-zinc-900 text-white relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop Guessing. Know Where You Stand Today.
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto text-base">
            Create your profile, paste your target job description, and get an explainable skill gap diagnostic and roadmap in under two minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-500 transition"
            >
              Get Started Now Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-3.5 text-base font-semibold text-zinc-200 hover:bg-zinc-700 transition"
            >
              Instant Demo Login
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
