import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Cpu, Heart, Layers, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      <section className="py-16 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Our Manifesto & Philosophy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Why We Refuse Black-Box AI in Career Diagnostics
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Career decisions are too important to leave to random generative tokens. Here is the engineering philosophy behind SkillGap AI.
          </p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section 1 */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-brand-600" />
              1. The Problem with "AI Magic"
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Most "AI career tools" are thin API wrappers around raw chat models. You paste a resume and a job description, and the model outputs a number like "83% match" without any consistent mathematical basis. Refresh the page or change one word, and the score fluctuates by 15 points.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Candidates are left more confused than before. Does 83% mean you meet 83% of the required tech stack? Does it mean you have an 83% probability of getting an interview? Does it factor in your missing database indexing knowledge?
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-600" />
              2. The Deterministic Scoring Engine
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              At SkillGap AI, we engineered a deterministic, rule-based diagnostic engine. When we analyze a job posting:
            </p>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Every required skill is weighed based on role critical path (e.g. 5x for React in a Frontend role, 4x for TypeScript).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Proficiency depth is evaluated on a 5-tier standard (Beginner &rarr; Elementary &rarr; Intermediate &rarr; Advanced &rarr; Expert).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Every single point deduction includes a human diagnostic explanation detailing exactly what concepts are missing.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              3. Radical Candidate Privacy
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We do not treat job seekers as leads to sell to staffing agencies. Your profile, resume text, project history, and roadmaps are completely private to your account. You can export your data at any time or permanently wipe your account with a single click.
            </p>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition"
            >
              Start Measuring Your Skills Deterministically
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
