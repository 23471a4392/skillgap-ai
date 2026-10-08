import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CAREER_ROLES, SAMPLE_BENCHMARK_JOBS } from '@skillgap/config';
import { calculateSkillGap, extractRequirementsFromText, generatePersonalizedRoadmap } from '@skillgap/analytics';
import { Profile } from '@skillgap/types';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillGap AI database seed...');

  // Hash demo password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Upsert demo user
  const user = await prisma.user.upsert({
    where: { email: 'alex.morgan@example.com' },
    update: {},
    create: {
      email: 'alex.morgan@example.com',
      passwordHash,
      name: 'Alex Morgan',
      role: 'user',
    },
  });

  console.log(`👤 Demo user created/verified: ${user.email} (ID: ${user.id})`);

  // Clear existing profile data if re-seeding
  await prisma.profile.deleteMany({ where: { userId: user.id } });
  await prisma.jobAnalysisRecord.deleteMany({ where: { userId: user.id } });
  await prisma.roadmapRecord.deleteMany({ where: { userId: user.id } });
  await prisma.progressLogRecord.deleteMany({ where: { userId: user.id } });
  await prisma.jobApplicationRecord.deleteMany({ where: { userId: user.id } });

  // Create Profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      headline: 'Aspiring Full-Stack Software Engineer | Final Year CS Undergrad',
      location: 'Austin, TX / Remote',
      phone: '+1 (512) 555-0194',
      degree: 'Bachelor of Science',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      cgpa: '3.82 / 4.00 (88%)',
      targetRoleId: 'role-fullstack',
      githubUrl: 'https://github.com/alexmorgan-dev',
      linkedinUrl: 'https://linkedin.com/in/alexmorgan-dev',
      portfolioUrl: 'https://alexmorgan.dev',
      bio: 'Final-year CS student passionate about building reliable, accessible web applications. Experienced in React, TypeScript, Node.js, and relational databases through coursework, hands-on portfolio projects, and a 3-month summer frontend engineering internship.',
    },
  });

  console.log(`📋 Profile created (ID: ${profile.id})`);

  // Seed Skills
  const userSkills = [
    { skillName: 'JavaScript', category: 'Programming Languages', proficiency: 'intermediate', yearsOfExp: 2.0, verified: true },
    { skillName: 'TypeScript', category: 'Programming Languages', proficiency: 'intermediate', yearsOfExp: 1.5, verified: true },
    { skillName: 'React', category: 'Frontend', proficiency: 'intermediate', yearsOfExp: 2.0, verified: true },
    { skillName: 'Node.js', category: 'Backend', proficiency: 'intermediate', yearsOfExp: 1.5, verified: true },
    { skillName: 'SQL', category: 'Database', proficiency: 'intermediate', yearsOfExp: 1.5, verified: true },
    { skillName: 'PostgreSQL', category: 'Database', proficiency: 'elementary', yearsOfExp: 1.0, verified: false },
    { skillName: 'Tailwind CSS', category: 'Frontend', proficiency: 'intermediate', yearsOfExp: 1.5, verified: true },
    { skillName: 'Python', category: 'Programming Languages', proficiency: 'elementary', yearsOfExp: 1.0, verified: false },
    { skillName: 'Technical Communication & Collaboration', category: 'Soft Skills', proficiency: 'intermediate', yearsOfExp: 1.0, verified: true },
  ];

  for (const skill of userSkills) {
    await prisma.userSkill.create({
      data: {
        profileId: profile.id,
        ...skill,
      },
    });
  }

  // Seed Education
  await prisma.education.create({
    data: {
      profileId: profile.id,
      institution: 'University of Texas at Austin',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startYear: 2022,
      endYear: 2026,
      grade: '3.82 / 4.00',
      isCurrent: true,
      description: 'Key Coursework: Data Structures & Algorithms, Relational Database Systems, Operating Systems, Computer Networks, Software Engineering Lab.',
    },
  });

  // Seed Experience & Internships
  await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'Apex Web Studios',
      role: 'Frontend Engineering Intern',
      location: 'Austin, TX',
      startDate: 'May 2025',
      endDate: 'August 2025',
      isCurrent: false,
      isInternship: true,
      description: 'Collaborated with a team of 4 engineers to develop responsive client dashboards using React, TypeScript, and Tailwind CSS. Optimized API data fetching patterns, cutting initial render latency by 28%. Wrote automated unit tests with Vitest.',
      skillsUsed: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Git', 'Automated Testing (Unit & Integration)']),
    },
  });

  // Seed Projects
  await prisma.project.create({
    data: {
      profileId: profile.id,
      title: 'DevPulse — Developer Productivity & Task Hub',
      description: 'A full-stack project and goal management dashboard for developer teams. Includes JWT-based authentication, real-time activity metrics, PostgreSQL schema migrations with Prisma, and interactive chart visualizations.',
      repoUrl: 'https://github.com/alexmorgan-dev/devpulse',
      liveUrl: 'https://devpulse-demo.app',
      complexity: 'Intermediate',
      skillsUsed: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'SQL', 'Tailwind CSS']),
      highlights: JSON.stringify([
        'Designed normalized relational database with 8 tables and indexed queries.',
        'Implemented secure JWT refresh token rotation and rate limiting.',
        'Built responsive UI with full keyboard accessibility.',
      ]),
    },
  });

  await prisma.project.create({
    data: {
      profileId: profile.id,
      title: 'MarkdownFlow — Collaborative Note Workspace',
      description: 'A markdown-based knowledge management tool featuring live preview, syntax highlighting, tag-based search indexing, and export to PDF/HTML.',
      repoUrl: 'https://github.com/alexmorgan-dev/markdown-flow',
      liveUrl: 'https://markdownflow.vercel.app',
      complexity: 'Intermediate',
      skillsUsed: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS']),
      highlights: JSON.stringify([
        'Engineered custom markdown parser with AST AST syntax rendering.',
        'Offline-first synchronization with IndexedDB storage.',
      ]),
    },
  });

  // Seed Certifications
  await prisma.certification.create({
    data: {
      profileId: profile.id,
      name: 'Meta Front-End Developer Specialization',
      issuingOrg: 'Meta / Coursera',
      issueDate: '2024-11',
      credentialId: 'META-FE-99482',
      credentialUrl: 'https://coursera.org/verify/professional-cert/META-FE-99482',
      skillsCovered: JSON.stringify(['React', 'JavaScript', 'HTML/CSS', 'UI Design']),
    },
  });

  // Run initial Job Analysis on Stripe benchmark
  const stripeSample = SAMPLE_BENCHMARK_JOBS[0];
  const domainProfile: Profile = {
    id: profile.id,
    userId: user.id,
    headline: profile.headline || '',
    location: profile.location || '',
    phone: profile.phone || '',
    degree: profile.degree || '',
    branch: profile.branch || '',
    graduationYear: profile.graduationYear || 2026,
    cgpa: profile.cgpa || '',
    targetRoleId: 'role-fullstack',
    targetRoleTitle: 'Full Stack Developer',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    bio: profile.bio || '',
    skills: userSkills.map((s, idx) => ({ id: `s-${idx}`, ...s })),
    education: [
      {
        id: 'edu-1',
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        isCurrent: true,
      },
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Apex Web Studios',
        role: 'Frontend Engineering Intern',
        startDate: 'May 2025',
        endDate: 'August 2025',
        isCurrent: false,
        isInternship: true,
        description: 'Frontend Intern',
        skillsUsed: ['React', 'TypeScript'],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'DevPulse',
        description: 'Full stack productivity app',
        complexity: 'Intermediate',
        skillsUsed: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'SQL'],
        highlights: [],
      },
    ],
    certifications: [],
  };

  const extracted = extractRequirementsFromText(stripeSample.description, stripeSample.jobTitle, stripeSample.targetRoleId);
  const analysisResult = calculateSkillGap(domainProfile, extracted);

  const savedAnalysis = await prisma.jobAnalysisRecord.create({
    data: {
      userId: user.id,
      jobTitle: stripeSample.jobTitle,
      company: stripeSample.company,
      location: stripeSample.location,
      rawJobDescription: stripeSample.description,
      targetRoleId: stripeSample.targetRoleId,
      overallScore: analysisResult.overallScore,
      potentialScore: analysisResult.potentialScore,
      technicalScore: analysisResult.technicalScore,
      experienceScore: analysisResult.experienceScore,
      educationScore: analysisResult.educationScore,
      softSkillsScore: analysisResult.softSkillsScore,
      projectScore: analysisResult.projectScore,
      keywordMatchScore: analysisResult.keywordMatchScore,
      verdict: analysisResult.verdict,
      summaryReason: analysisResult.summaryReason,
      matchedSkillsJson: JSON.stringify(analysisResult.matchedSkills),
      missingSkillsJson: JSON.stringify(analysisResult.missingSkills),
      partialGapsJson: JSON.stringify(analysisResult.partialGaps),
      recommendedActionsJson: JSON.stringify(analysisResult.recommendedActions),
      weightsUsedJson: JSON.stringify(analysisResult.weightsUsed),
    },
  });

  console.log(`📊 Initial Benchmark Analysis created: ${savedAnalysis.jobTitle} at ${savedAnalysis.company} (Score: ${savedAnalysis.overallScore}%)`);

  // Generate Personalized Roadmap for this analysis
  const roadmapData = generatePersonalizedRoadmap(
    {
      ...analysisResult,
      id: savedAnalysis.id,
      userId: user.id,
      rawJobDescription: stripeSample.description,
      createdAt: new Date().toISOString(),
    },
    'Full Stack Developer'
  );

  // Mark first task of first milestone as completed to show realistic progress
  if (roadmapData.milestones.length > 0 && roadmapData.milestones[0].actionableTasks.length > 0) {
    roadmapData.milestones[0].actionableTasks[0].completed = true;
  }

  await prisma.roadmapRecord.create({
    data: {
      userId: user.id,
      analysisId: savedAnalysis.id,
      title: 'Targeted Gap-Closing Roadmap for Stripe Full-Stack Role',
      targetRole: 'Full Stack Developer',
      totalWeeks: roadmapData.totalWeeks,
      estimatedHours: roadmapData.estimatedHours,
      status: 'active',
      progressPercentage: 15,
      milestonesJson: JSON.stringify(roadmapData.milestones),
    },
  });

  console.log(`🗺️ Personalized Roadmap seeded (${roadmapData.totalWeeks} weeks, ${roadmapData.estimatedHours} hours)`);

  // Seed Progress Logs
  await prisma.progressLogRecord.create({
    data: {
      userId: user.id,
      activityType: 'course_completed',
      completedItem: 'Docker for Developers: Multi-Stage Builds & Networking',
      description: 'Learned Dockerfile layer optimization, multi-stage builds, and docker-compose for multi-service environments.',
      hoursSpent: 8.5,
      scoreDelta: 4,
    },
  });

  await prisma.progressLogRecord.create({
    data: {
      userId: user.id,
      activityType: 'skill_practiced',
      completedItem: 'PostgreSQL EXPLAIN ANALYZE & B-Tree Indexing Workshop',
      description: 'Practiced identifying sequential scans and added composite indexes to speed up query execution plans.',
      hoursSpent: 5.0,
      scoreDelta: 3,
    },
  });

  // Seed Job Applications
  await prisma.jobApplicationRecord.create({
    data: {
      userId: user.id,
      company: 'Stripe',
      jobTitle: 'Software Engineer - Full Stack',
      location: 'San Francisco, CA / Remote',
      salaryRange: '$125,000 - $155,000',
      status: 'screening',
      jobUrl: 'https://stripe.com/jobs',
      notes: 'Initial recruiter screen scheduled for next Tuesday. Review Stripe API docs and explain DevPulse architecture.',
      appliedDate: '2026-10-01',
      lastFollowUp: '2026-10-06',
      analysisId: savedAnalysis.id,
      matchScore: savedAnalysis.overallScore,
    },
  });

  await prisma.jobApplicationRecord.create({
    data: {
      userId: user.id,
      company: 'Datadog',
      jobTitle: 'Associate Software Engineer',
      location: 'New York, NY / Remote',
      salaryRange: '$115,000 - $140,000',
      status: 'applied',
      jobUrl: 'https://datadoghq.com/careers',
      notes: 'Submitted resume highlighting Apex Web Studios internship and PostgreSQL experience.',
      appliedDate: '2026-10-04',
      matchScore: 82,
    },
  });

  await prisma.jobApplicationRecord.create({
    data: {
      userId: user.id,
      company: 'Vercel',
      jobTitle: 'Junior Frontend Engineer',
      location: 'Remote',
      salaryRange: '$110,000 - $135,000',
      status: 'wishlist',
      notes: 'Plan to apply after leveling up Automated Testing and adding Next.js demo to portfolio.',
      matchScore: 86,
    },
  });

  console.log('✅ Database seeded successfully with realistic humanized data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
