# SkillGap AI — API Reference

## Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user account and initialize profile | No |
| POST | `/api/auth/login` | Authenticate with email and password | No |
| GET | `/api/auth/me` | Fetch authenticated user data, profile, and stats | Yes |
| POST | `/api/auth/logout` | Invalidate current session token | Yes |
| POST | `/api/auth/logout-all` | Invalidate all active user sessions | Yes |
| POST | `/api/auth/change-password` | Update account password with verification | Yes |
| POST | `/api/auth/forgot-password` | Dispatch password reset email/instructions | No |
| GET | `/api/auth/sessions` | List active browser and device sessions | Yes |
| DELETE | `/api/auth/delete-account` | Permanently wipe account and records | Yes |

---

## Profile Management (`/api/profile`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/profile` | Get full candidate profile (skills, edu, exp, proj) | Yes |
| PATCH | `/api/profile` | Update contact, headline, links, and target role | Yes |
| POST | `/api/profile/skills` | Add or update skill in inventory | Yes |
| PATCH | `/api/profile/skills/:id` | Update proficiency or experience years | Yes |
| DELETE | `/api/profile/skills/:id` | Delete skill from profile | Yes |
| POST | `/api/profile/education` | Add education credential | Yes |
| DELETE | `/api/profile/education/:id` | Remove education record | Yes |
| POST | `/api/profile/experience` | Add internship or work experience | Yes |
| DELETE | `/api/profile/experience/:id` | Remove experience entry | Yes |
| POST | `/api/profile/projects` | Add portfolio project with repo/live links | Yes |
| DELETE | `/api/profile/projects/:id` | Delete project | Yes |
| POST | `/api/profile/certifications` | Add professional certification | Yes |
| DELETE | `/api/profile/certifications/:id`| Remove certification | Yes |

---

## Analysis & Diagnostics (`/api/analysis`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/analysis/analyze` | Run deterministic analysis against candidate profile | Yes |
| GET | `/api/analysis/history` | List all historical job analyses | Yes |
| GET | `/api/analysis/:id` | Get individual analysis with explainable gaps | Yes |
| GET | `/api/analysis/benchmarks`| Fetch curated industry benchmark jobs | No |
| POST | `/api/analysis/compare` | Compare 2 or 3 job analyses side-by-side | Yes |

---

## Roadmaps (`/api/roadmap`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/roadmap` | Get active personalized roadmap | Yes |
| GET | `/api/roadmap/:id` | Get specific roadmap by ID | Yes |
| PATCH | `/api/roadmap/task/toggle` | Toggle task completion and update progress % | Yes |

---

## Progress Tracking (`/api/progress`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/progress` | Get study hours summary, velocity logs, streak | Yes |
| POST | `/api/progress/log` | Log dedicated study hours, course, or project | Yes |
| POST | `/api/progress/retest` | Retest skill readiness and calibrate score delta | Yes |

---

## Job Application Pipeline (`/api/applications`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/applications` | Get all tracked applications | Yes |
| POST | `/api/applications` | Log new job application (Wishlist -> Offer) | Yes |
| PATCH | `/api/applications/:id`| Move stage or update interview notes | Yes |
| DELETE | `/api/applications/:id`| Delete tracked application | Yes |

---

## Resume Parsing (`/api/resume`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/resume/parse` | Extract skills, education, and links from text | Yes |
| POST | `/api/resume/apply` | Sync extracted entities directly to user profile | Yes |
