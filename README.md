# SkillGap AI

> **"Know where you stand. Know what to learn next."**

SkillGap AI is a full-scale, humanized web application engineered to bridge the gap between candidate skill profiles and real-world software engineering job descriptions. Built with a deterministic, explainable scoring engine, transparent partial depth diagnostics, and personalized 12-week learning roadmaps.

---

## ⚡ Instant Demo Credentials

For immediate exploration with complete pre-seeded realistic data (Alex Morgan, final-year CS undergrad, 80% readiness match on Stripe Full Stack role, active roadmap, and application pipeline):

- **Demo Account Button**: 1-Click login available directly on the landing page and login modal.
- **Email**: `alex.morgan@example.com`
- **Password**: `Password123!`

---

## 🏗️ Humanized Product Philosophy

SkillGap AI rejects black-box generative AI wrappers that output arbitrary percentages without mathematical justification:

- **Deterministic Scoring**: Transparent, reproducible math based on role weights ($S_{\text{tech}} 50\%$, $S_{\text{exp}} 20\%$, $S_{\text{proj}} 10\%$, $S_{\text{edu}} 10\%$, $S_{\text{soft}} 10\%$).
- **Explainable Partial Depth Diagnostics**: Distinguishes between binary missing skills and depth gaps (e.g. Intermediate SQL vs Advanced SQL).
- **Curated Free Resources**: Roadmaps link directly to official documentation, open-source guides (System Design Primer, Full Stack Open), and interactive exercises.
- **Radical Privacy**: Zero data selling. Complete GDPR data portability (JSON export) and permanent one-click account deletion.

---

## 🧭 Implemented Working Pages

### Public Routes
- **`/` (Landing Page)**: Full startup landing page featuring Hero, Problem comparison, How it works, Explainable analysis preview, Phased roadmap preview, 15+ Role catalog tabs, FAQ accordion, and Final CTA.
- **`/features`**: Technical architecture and capability deep-dive.
- **`/careers`**: Role benchmark catalog with search, department filtering, compensation ranges, and skill requirements.
- **`/about`**: Product manifesto on why deterministic scoring beats black-box AI hallucinations.
- **`/login`**: Sign-in with password hashing, error handling, and 1-click demo login.
- **`/register`**: Registration with live password strength checklist and target role selection.
- **`/forgot-password`**: Password recovery dispatch flow.

### Authenticated Routes (AppLayout with Collapsible Sidebar)
- **`/dashboard`**: Executive dashboard with readiness gauge, active role indicator, top critical gaps, active roadmap milestone with interactive checklist, velocity metrics, and application pipeline summary.
- **`/profile`**: Complete profile manager (personal info, GitHub/LinkedIn links, education with GPA, work experience & internships, bio).
- **`/skills`**: Interactive skill inventory categorized across 15 domains with 5-tier proficiency grading (Beginner to Expert).
- **`/resume`**: Resume entity parser with sample loader and 1-click sync to user profile.
- **`/job-analysis`**: Job description analyzer with pre-loaded benchmark jobs (Stripe, Meta, Netflix, OpenAI) and custom paste input.
- **`/job-analysis/:id`**: Deep explainable diagnostic breakdown with 5-factor scoring, matched vs missing skills, and actionable depth cards.
- **`/compare`**: Side-by-side comparison matrix for 2 or 3 job analyses with strategic recommendations.
- **`/roadmap`**: Active personalized roadmap with 4 phases, weekly time estimates, actionable task checkboxes, and free resources.
- **`/roadmap/:id`**: Milestone detail view.
- **`/progress`**: Velocity tracker with study hours logger, streak counter, and **Retest Readiness** scoring engine.
- **`/projects`**: Portfolio project manager with complexity badges, tech stack verification, and GitHub/live demo links.
- **`/certifications`**: Professional certification tracker with verification links and issuing organizations.
- **`/applications`**: Full Kanban application tracker (Wishlist, Applied, Screening, Technical Interview, Offer).
- **`/history`**: Audit trail of all previous job analyses.
- **`/settings`**: Account security, password updates, active browser session manager, JSON export, and account deletion.

---

## 🛠️ Tech Stack & Monorepo Architecture

```
skillgap-ai/
├── apps/
│   ├── web/          # React 18, TypeScript, Tailwind CSS, Vite, React Router v6
│   └── api/          # Node.js, Express, TypeScript, Prisma ORM, JWT, bcrypt
├── packages/
│   ├── types/        # Unified TypeScript data interfaces
│   ├── config/       # 100+ master skills, 15 career roles, benchmark job postings
│   ├── analytics/     # Pure deterministic scoring engine & roadmap generator
│   ├── validation/   # Zod runtime input validation schemas
│   └── ui/           # Styling tokens, badge utilities, score gauge helpers
├── database/
│   ├── prisma/       # Prisma schema (SQLite local / PostgreSQL prod)
│   └── seed/         # Real-world initial seeder (Alex Morgan demo account)
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── nginx.conf
├── tests/            # Vitest unit test suites
└── docker-compose.yml
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Install Monorepo Dependencies
```bash
cd skillgap-ai
npm install
```

### 2. Initialize Database & Seed Demo Data
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Run Development Servers
In two terminal tabs or concurrently:

```bash
# Terminal 1: Backend API (runs on http://localhost:5000)
npm run dev:api

# Terminal 2: Web Client (runs on http://localhost:5173)
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🧪 Running Unit Tests
```bash
npx vitest run tests/analytics.test.ts
```

All deterministic scoring tests run in isolated environments and verify 100% mathematical consistency.

---

## 🐳 Docker Production Deployment
```bash
docker compose up --build
```
This spins up:
- PostgreSQL 16 on port 5432
- SkillGap API backend on port 5000
- SkillGap Web frontend on port 80 (served via optimized Nginx)

---

## 📄 License
MIT © SkillGap AI Team
