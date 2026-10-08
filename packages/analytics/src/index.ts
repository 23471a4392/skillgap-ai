import { CAREER_ROLES, MASTER_SKILLS, PROFICIENCY_RANKS } from '@skillgap/config';
import {
  ExtractedJobRequirements,
  JobAnalysis,
  MatchedSkillItem,
  MissingSkillItem,
  PartialGapItem,
  Profile,
  ProficiencyLevel,
  RoadmapMilestone,
  SkillCategory,
} from '@skillgap/types';

// Map common aliases to canonical skill names
const SKILL_ALIASES: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  python3: 'Python',
  react: 'React',
  'react.js': 'React',
  reactjs: 'React',
  next: 'Next.js',
  'next.js': 'Next.js',
  nextjs: 'Next.js',
  node: 'Node.js',
  'node.js': 'Node.js',
  nodejs: 'Node.js',
  express: 'Node.js',
  'express.js': 'Node.js',
  fastapi: 'FastAPI',
  springboot: 'Spring Boot',
  'spring boot': 'Spring Boot',
  java: 'Java',
  golang: 'Go (Golang)',
  go: 'Go (Golang)',
  sql: 'SQL',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  redis: 'Redis',
  docker: 'Docker',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  aws: 'AWS Cloud Services',
  'amazon web services': 'AWS Cloud Services',
  'github actions': 'CI/CD Pipelines (GitHub Actions)',
  'ci/cd': 'CI/CD Pipelines (GitHub Actions)',
  cicd: 'CI/CD Pipelines (GitHub Actions)',
  pandas: 'Pandas & NumPy',
  numpy: 'Pandas & NumPy',
  'scikit-learn': 'Machine Learning (Scikit-Learn)',
  sklearn: 'Machine Learning (Scikit-Learn)',
  'machine learning': 'Machine Learning (Scikit-Learn)',
  pytorch: 'Deep Learning (PyTorch)',
  'deep learning': 'Deep Learning (PyTorch)',
  llm: 'LLMs & Generative AI',
  llms: 'LLMs & Generative AI',
  'generative ai': 'LLMs & Generative AI',
  'prompt engineering': 'LLMs & Generative AI',
  rag: 'LLMs & Generative AI',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  'unit testing': 'Automated Testing (Unit & Integration)',
  jest: 'Automated Testing (Unit & Integration)',
  vitest: 'Automated Testing (Unit & Integration)',
  'system design': 'System Design & Distributed Systems',
  'distributed systems': 'System Design & Distributed Systems',
  communication: 'Technical Communication & Collaboration',
};

/**
 * Extracts structured requirements from raw job text using deterministic entity matching.
 */
export function extractRequirementsFromText(
  rawText: string,
  jobTitle: string,
  targetRoleId?: string
): ExtractedJobRequirements {
  const lowerText = rawText.toLowerCase();

  // Try to find matching role benchmark if available
  const matchedRole = targetRoleId
    ? CAREER_ROLES.find((r) => r.id === targetRoleId)
    : CAREER_ROLES.find(
        (r) =>
          jobTitle.toLowerCase().includes(r.slug) ||
          r.title.toLowerCase().split(' ').some((w) => w.length > 3 && jobTitle.toLowerCase().includes(w))
      );

  // Extract years of experience
  let requiredExperienceYears = 0;
  const expMatch = lowerText.match(/(\d+)\+?\s*(?:to\s*\d+\s*)?years?(?:\s*of)?\s*(?:relevant\s*)?experience/);
  if (expMatch && expMatch[1]) {
    requiredExperienceYears = parseInt(expMatch[1], 10);
  } else if (matchedRole) {
    requiredExperienceYears = matchedRole.minExperienceYears;
  }

  // Extract degree requirement
  let minDegree = 'Bachelor of Science in Computer Science or equivalent';
  if (lowerText.includes('master') || lowerText.includes('m.s.') || lowerText.includes('ms degree')) {
    minDegree = 'Master of Science in CS/Data Science';
  } else if (lowerText.includes('phd') || lowerText.includes('ph.d')) {
    minDegree = 'Ph.D. in Computer Science or related quantitative field';
  }

  // Detect skills mentioned in text
  const detectedSkills = new Map<string, { required: boolean; weight: number }>();

  // Check aliases in text
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    // Word boundary check
    const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      // Check if it appears in preferred/bonus section
      const isPreferred =
        lowerText.indexOf('preferred') > -1 &&
        lowerText.indexOf(alias) > lowerText.indexOf('preferred') &&
        (lowerText.indexOf('requirements') === -1 || lowerText.indexOf(alias) < lowerText.indexOf('requirements'));

      if (!detectedSkills.has(canonical)) {
        detectedSkills.set(canonical, {
          required: !isPreferred,
          weight: isPreferred ? 2 : 4,
        });
      }
    }
  }

  // If role matched, ensure benchmark skills are included
  if (matchedRole) {
    matchedRole.requiredSkills.forEach((req) => {
      if (!detectedSkills.has(req.name)) {
        detectedSkills.set(req.name, { required: true, weight: req.weight });
      }
    });
  }

  const requiredSkills: Array<{ name: string; category: SkillCategory; minProficiency: ProficiencyLevel; weight: number }> = [];
  const preferredSkills: Array<{ name: string; category: SkillCategory; minProficiency: ProficiencyLevel; weight: number }> = [];

  detectedSkills.forEach((info, skillName) => {
    const master = MASTER_SKILLS.find((s) => s.name === skillName);
    const category = master ? master.category : 'Tools';
    const minProficiency: ProficiencyLevel =
      requiredExperienceYears >= 3 ? 'advanced' : requiredExperienceYears >= 1 ? 'intermediate' : 'elementary';

    const item = {
      name: skillName,
      category,
      minProficiency,
      weight: info.weight,
    };

    if (info.required) {
      requiredSkills.push(item);
    } else {
      preferredSkills.push(item);
    }
  });

  // Extract tools
  const commonTools = ['Git', 'GitHub', 'Postman', 'Figma', 'VSCode', 'Jira', 'Linux', 'Vercel'];
  const detectedTools = commonTools.filter((tool) =>
    new RegExp(`\\b${tool}\\b`, 'i').test(rawText)
  );

  // Extract soft skills
  const softSkillsCatalog = [
    'Technical Communication & Collaboration',
    'Problem Solving',
    'Teamwork',
    'Critical Thinking',
    'Adaptability',
    'Time Management',
  ];
  const detectedSoftSkills = softSkillsCatalog.filter((s) =>
    lowerText.includes(s.toLowerCase()) || lowerText.includes(s.split(' ')[0].toLowerCase())
  );
  if (detectedSoftSkills.length === 0) {
    detectedSoftSkills.push('Technical Communication & Collaboration', 'Problem Solving');
  }

  return {
    jobTitle,
    company: 'Target Company',
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : (matchedRole ? matchedRole.requiredSkills : []),
    preferredSkills,
    requiredExperienceYears,
    minDegree,
    softSkills: detectedSoftSkills,
    toolsAndPlatforms: detectedTools,
    responsibilities: [
      'Design, build, and maintain production-ready software systems.',
      'Collaborate across engineering, product, and design teams.',
      'Write clean, testable, and maintainable code adhering to industry best practices.',
    ],
    keywords: Array.from(detectedSkills.keys()),
  };
}

/**
 * Calculates a deterministic, explainable skill gap analysis between a user profile and job requirements.
 */
export function calculateSkillGap(
  profile: Profile,
  extracted: ExtractedJobRequirements,
  weightsOverride?: {
    technicalSkills: number;
    experience: number;
    education: number;
    softSkills: number;
    projects: number;
  }
): Omit<JobAnalysis, 'id' | 'userId' | 'rawJobDescription' | 'createdAt'> {
  const matchedSkills: MatchedSkillItem[] = [];
  const missingSkills: MissingSkillItem[] = [];
  const partialGaps: PartialGapItem[] = [];

  const userSkillsMap = new Map<string, ProficiencyLevel>();
  profile.skills.forEach((s) => {
    userSkillsMap.set(s.skillName.toLowerCase(), s.proficiency);
  });

  // Also collect skills evidenced in projects and experience
  const projectSkills = new Set<string>();
  profile.projects.forEach((p) => {
    p.skillsUsed.forEach((s) => projectSkills.add(s.toLowerCase()));
  });

  let totalRequiredWeight = 0;
  let earnedTechnicalWeight = 0;

  // Process required skills
  extracted.requiredSkills.forEach((req) => {
    const canonicalName = req.name;
    const userProficiency = userSkillsMap.get(canonicalName.toLowerCase());
    const targetRank = PROFICIENCY_RANKS[req.minProficiency];
    totalRequiredWeight += req.weight;

    const master = MASTER_SKILLS.find((s) => s.name === canonicalName);
    const category = master ? master.category : req.category;

    if (!userProficiency) {
      // Missing completely
      const hours = req.minProficiency === 'advanced' ? 60 : req.minProficiency === 'intermediate' ? 35 : 15;
      missingSkills.push({
        name: canonicalName,
        category,
        requiredProficiency: req.minProficiency,
        importance: 'critical',
        estimatedHoursToAcquire: hours,
        recommendedResource: (master && master.learningResources[0]) || {
          title: `${canonicalName} Official Documentation`,
          url: 'https://developer.mozilla.org',
          type: 'documentation',
          isFree: true,
        },
      });
    } else {
      const userRank = PROFICIENCY_RANKS[userProficiency];

      if (userRank >= targetRank) {
        // Full match
        earnedTechnicalWeight += req.weight;
        matchedSkills.push({
          name: canonicalName,
          category,
          userProficiency,
          requiredProficiency: req.minProficiency,
          isRequirementMet: true,
          scoreContribution: req.weight,
          evidenceSource: projectSkills.has(canonicalName.toLowerCase())
            ? 'Verified in Portfolio Projects'
            : 'Self-Reported Skill',
        });
      } else {
        // Partial gap
        const ratio = userRank / targetRank;
        earnedTechnicalWeight += req.weight * ratio;

        matchedSkills.push({
          name: canonicalName,
          category,
          userProficiency,
          requiredProficiency: req.minProficiency,
          isRequirementMet: false,
          scoreContribution: req.weight * ratio,
          evidenceSource: 'Partial proficiency',
        });

        const topics = master?.typicalProficiencyLevels[req.minProficiency] || 'Advanced concepts and optimization';
        partialGaps.push({
          skillName: canonicalName,
          currentProficiency: userProficiency,
          targetProficiency: req.minProficiency,
          gapSeverity: targetRank - userRank > 1 ? 'high' : 'medium',
          humanExplanation: `Your ${canonicalName} foundation (${userProficiency}) matches basic usage, but the job expects ${req.minProficiency}. Expected capabilities: ${topics}.`,
          actionableTopics: [
            `Study ${canonicalName} ${req.minProficiency} architectural patterns`,
            `Implement real-world project demonstrating ${req.minProficiency} features`,
            `Review benchmark codebases and best practices`,
          ],
        });
      }
    }
  });

  // Calculate Technical Score (0-100)
  const technicalScore =
    totalRequiredWeight > 0 ? Math.round((earnedTechnicalWeight / totalRequiredWeight) * 100) : 70;

  // Calculate Experience Score (0-100)
  let userYears = 0;
  profile.experience.forEach((exp) => {
    // If start date is present, calculate years
    const multiplier = exp.isInternship ? 0.75 : 1.0;
    userYears += 1.0 * multiplier; // Default 1 year per experience entry if not parsed
  });

  let experienceScore = 100;
  if (extracted.requiredExperienceYears > 0) {
    if (userYears >= extracted.requiredExperienceYears) {
      experienceScore = 100;
    } else {
      experienceScore = Math.max(30, Math.round((userYears / extracted.requiredExperienceYears) * 100));
    }
  } else {
    // Fresher friendly
    experienceScore = userYears > 0 ? 100 : 85;
  }

  // Calculate Education Score (0-100)
  let educationScore = 80;
  if (profile.degree) {
    educationScore = 95;
    if (profile.cgpa && parseFloat(profile.cgpa) >= 8.0) {
      educationScore = 100;
    }
  }

  // Calculate Soft Skills Score (0-100)
  let softSkillsScore = 75;
  if (profile.skills.some((s) => s.category === 'Soft Skills')) {
    softSkillsScore = 90;
  }

  // Calculate Projects Score (0-100)
  let projectScore = 50;
  if (profile.projects.length >= 3) {
    projectScore = 100;
  } else if (profile.projects.length === 2) {
    projectScore = 85;
  } else if (profile.projects.length === 1) {
    projectScore = 70;
  }

  // Keyword match score
  const matchedKeywordsCount = matchedSkills.length;
  const totalKeywordsCount = Math.max(1, matchedSkills.length + missingSkills.length);
  const keywordMatchScore = Math.round((matchedKeywordsCount / totalKeywordsCount) * 100);

  // Apply weights
  const weights = weightsOverride || {
    technicalSkills: 50,
    experience: 20,
    education: 10,
    softSkills: 10,
    projects: 10,
  };

  const overallScore = Math.round(
    (technicalScore * weights.technicalSkills +
      experienceScore * weights.experience +
      educationScore * weights.education +
      softSkillsScore * weights.softSkills +
      projectScore * weights.projects) /
      100
  );

  // Calculate Potential Score (if top 3 missing skills and partial gaps are addressed)
  const potentialScore = Math.min(
    98,
    Math.round(overallScore + (100 - technicalScore) * 0.75 + (100 - projectScore) * 0.15)
  );

  // Verdict and human summary
  let verdict: 'Interview Ready' | 'Competitive Contender' | 'Upskilling Needed' | 'Significant Gap';
  let summaryReason: string;

  if (overallScore >= 80) {
    verdict = 'Interview Ready';
    summaryReason = `You meet ${matchedSkills.length} core technical requirements for this role. Your portfolio and technical foundations align closely with the team's expectations.`;
  } else if (overallScore >= 65) {
    verdict = 'Competitive Contender';
    summaryReason = `You have strong foundations with ${matchedSkills.length} matching skills, but ${missingSkills.length} key competencies or depth gaps need targeted focus before interview readiness.`;
  } else if (overallScore >= 50) {
    verdict = 'Upskilling Needed';
    summaryReason = `You show foundational potential, but key requirements (${missingSkills.slice(0, 2).map((s) => s.name).join(', ')}) are currently missing from your profile.`;
  } else {
    verdict = 'Significant Gap';
    summaryReason = `The role requires specialized skills and experience that do not yet align with your current profile. We recommend following a structured 12-week roadmap.`;
  }

  // Generate recommended actions
  const recommendedActions: string[] = [];
  if (missingSkills.length > 0) {
    recommendedActions.push(
      `Close critical skill gap: Spend ~${missingSkills[0].estimatedHoursToAcquire} hours learning ${missingSkills[0].name} using ${missingSkills[0].recommendedResource.title}.`
    );
  }
  if (partialGaps.length > 0) {
    recommendedActions.push(
      `Deepen ${partialGaps[0].skillName} proficiency from ${partialGaps[0].currentProficiency} to ${partialGaps[0].targetProficiency} by building an end-to-end feature.`
    );
  }
  if (profile.projects.length < 2) {
    recommendedActions.push('Build at least one production-grade portfolio project demonstrating your core tech stack with live demo and source code.');
  }

  return {
    jobTitle: extracted.jobTitle,
    company: extracted.company,
    location: extracted.location,
    targetRoleId: undefined,
    targetRoleTitle: undefined,
    overallScore,
    potentialScore,
    technicalScore,
    experienceScore,
    educationScore,
    softSkillsScore,
    projectScore,
    keywordMatchScore,
    verdict,
    summaryReason,
    matchedSkills,
    missingSkills,
    partialGaps,
    recommendedActions,
    weightsUsed: weights,
  };
}

/**
 * Generates a tailored roadmap based on user's actual missing and partial skills.
 */
export function generatePersonalizedRoadmap(
  analysis: JobAnalysis,
  targetRoleTitle: string
): { totalWeeks: number; estimatedHours: number; milestones: RoadmapMilestone[] } {
  const milestones: RoadmapMilestone[] = [];
  let order = 1;
  let totalWeeks = 0;
  let totalHours = 0;

  // Phase 1: Critical Missing Skills
  if (analysis.missingSkills.length > 0) {
    const topMissing = analysis.missingSkills.slice(0, 3);
    const weeks = Math.max(2, Math.min(4, topMissing.length * 1.5));
    const hours = topMissing.reduce((acc, curr) => acc + curr.estimatedHoursToAcquire, 0);

    totalWeeks += weeks;
    totalHours += hours;

    milestones.push({
      id: `milestone-${order}`,
      roadmapId: '',
      order: order++,
      phase: 'Foundation Gaps',
      title: `Master Core Missing Skills: ${topMissing.map((s) => s.name).join(', ')}`,
      description: `Target the highest-impact gaps identified in your analysis to qualify for technical screens.`,
      skillsFocus: topMissing.map((s) => s.name),
      estimatedWeeks: Math.round(weeks),
      completed: false,
      actionableTasks: topMissing.flatMap((s) => [
        { id: `task-${s.name}-1`, text: `Complete hands-on tutorial for ${s.name} (${s.recommendedResource.title})`, completed: false },
        { id: `task-${s.name}-2`, text: `Build a standalone working prototype or script utilizing ${s.name}`, completed: false },
      ]),
      resources: topMissing.map((s) => s.recommendedResource),
    });
  }

  // Phase 2: Deepening Partial Gaps
  if (analysis.partialGaps.length > 0) {
    const topPartial = analysis.partialGaps.slice(0, 2);
    const weeks = 3;
    const hours = 30;
    totalWeeks += weeks;
    totalHours += hours;

    milestones.push({
      id: `milestone-${order}`,
      roadmapId: '',
      order: order++,
      phase: 'Core Competency Depth',
      title: `Level Up ${topPartial.map((s) => s.skillName).join(' & ')} to ${topPartial[0].targetProficiency.toUpperCase()}`,
      description: `Move beyond syntax into performance tuning, error boundaries, and architectural patterns.`,
      skillsFocus: topPartial.map((s) => s.skillName),
      estimatedWeeks: weeks,
      completed: false,
      actionableTasks: topPartial.flatMap((p) =>
        p.actionableTopics.map((topic, i) => ({
          id: `task-${p.skillName}-${i}`,
          text: topic,
          completed: false,
        }))
      ),
      resources: [
        {
          title: `${topPartial[0].skillName} Best Practices Guide`,
          url: 'https://github.com/goldbergyoni/nodebestpractices',
          type: 'documentation',
          isFree: true,
        },
      ],
    });
  }

  // Phase 3: Portfolio Capstone
  totalWeeks += 3;
  totalHours += 35;
  milestones.push({
    id: `milestone-${order}`,
    roadmapId: '',
    order: order++,
    phase: 'Portfolio Capstone',
    title: `Build & Deploy Proof-of-Work Project for ${targetRoleTitle}`,
    description: `Create a deployable full-stack application that directly integrates the required skills from this job analysis.`,
    skillsFocus: analysis.matchedSkills.slice(0, 3).map((s) => s.name),
    estimatedWeeks: 3,
    completed: false,
    actionableTasks: [
      { id: `task-proj-1`, text: 'Architect clean database schema and REST API endpoints', completed: false },
      { id: `task-proj-2`, text: 'Implement accessible, responsive UI with unit & integration tests', completed: false },
      { id: `task-proj-3`, text: 'Deploy to cloud with live URL and comprehensive README with architectural diagrams', completed: false },
    ],
    resources: [
      {
        title: 'Full-Stack Open Course',
        url: 'https://fullstackopen.com/en/',
        type: 'course',
        isFree: true,
      },
    ],
  });

  // Phase 4: Interview & Technical Screen Readiness
  totalWeeks += 2;
  totalHours += 20;
  milestones.push({
    id: `milestone-${order}`,
    roadmapId: '',
    order: order++,
    phase: 'Interview Mastery',
    title: `Technical Interview Drills & Behavioral Preparation`,
    description: `Prepare for live coding, system design discussions, and STAR-format behavioral questions.`,
    skillsFocus: ['Technical Communication & Collaboration', 'System Design & Distributed Systems'],
    estimatedWeeks: 2,
    completed: false,
    actionableTasks: [
      { id: `task-int-1`, text: 'Practice 15 role-specific coding questions and explain solutions out loud', completed: false },
      { id: `task-int-2`, text: 'Formulate 4 STAR stories highlighting projects, technical hurdles, and team impact', completed: false },
      { id: `task-int-3`, text: 'Conduct a mock technical interview with a peer or mentor', completed: false },
    ],
    resources: [
      {
        title: 'Tech Interview Handbook',
        url: 'https://www.techinterviewhandbook.org/',
        type: 'book',
        isFree: true,
      },
    ],
  });

  return {
    totalWeeks,
    estimatedHours: totalHours,
    milestones,
  };
}
