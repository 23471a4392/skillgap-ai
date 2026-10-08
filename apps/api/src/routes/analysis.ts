import { Router } from 'express';
import { prisma } from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { JobAnalysisInputSchema } from '@skillgap/validation';
import { calculateSkillGap, extractRequirementsFromText, generatePersonalizedRoadmap } from '@skillgap/analytics';
import { CAREER_ROLES, SAMPLE_BENCHMARK_JOBS } from '@skillgap/config';
import { Profile } from '@skillgap/types';

const router = Router();
router.use(authMiddleware);

// Helper to assemble domain profile from DB
async function getFullDomainProfile(userId: string): Promise<Profile> {
  let profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      skills: true,
      education: true,
      experience: true,
      projects: true,
      certifications: true,
    },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: { userId, headline: 'Software Professional' },
      include: {
        skills: true,
        education: true,
        experience: true,
        projects: true,
        certifications: true,
      },
    });
  }

  const targetRole = profile.targetRoleId ? CAREER_ROLES.find((r) => r.id === profile?.targetRoleId) : undefined;

  return {
    id: profile.id,
    userId,
    headline: profile.headline || '',
    location: profile.location || '',
    phone: profile.phone || '',
    degree: profile.degree || '',
    branch: profile.branch || '',
    graduationYear: profile.graduationYear || undefined,
    cgpa: profile.cgpa || '',
    targetRoleId: profile.targetRoleId || undefined,
    targetRoleTitle: targetRole ? targetRole.title : undefined,
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    bio: profile.bio || '',
    skills: profile.skills.map((s) => ({
      id: s.id,
      skillName: s.skillName,
      category: s.category as any,
      proficiency: s.proficiency as any,
      yearsOfExp: s.yearsOfExp,
      lastUsedYear: s.lastUsedYear || undefined,
      verified: s.verified,
    })),
    education: profile.education.map((e) => ({
      id: e.id,
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
      startYear: e.startYear,
      endYear: e.endYear || undefined,
      grade: e.grade || undefined,
      isCurrent: e.isCurrent,
      description: e.description || undefined,
    })),
    experience: profile.experience.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      location: e.location || undefined,
      startDate: e.startDate,
      endDate: e.endDate || undefined,
      isCurrent: e.isCurrent,
      isInternship: e.isInternship,
      description: e.description,
      skillsUsed: JSON.parse(e.skillsUsed || '[]'),
    })),
    projects: profile.projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      repoUrl: p.repoUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      complexity: p.complexity as any,
      skillsUsed: JSON.parse(p.skillsUsed || '[]'),
      highlights: JSON.parse(p.highlights || '[]'),
    })),
    certifications: profile.certifications.map((c) => ({
      id: c.id,
      name: c.name,
      issuingOrg: c.issuingOrg,
      issueDate: c.issueDate,
      expiryDate: c.expiryDate || undefined,
      credentialId: c.credentialId || undefined,
      credentialUrl: c.credentialUrl || undefined,
      skillsCovered: JSON.parse(c.skillsCovered || '[]'),
    })),
  };
}

// GET /api/analysis/benchmarks
router.get('/benchmarks', (req, res) => {
  res.json({ benchmarks: SAMPLE_BENCHMARK_JOBS });
});

// GET /api/analysis/history
router.get('/history', async (req: AuthRequest, res, next) => {
  try {
    const analyses = await prisma.jobAnalysisRecord.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = analyses.map((a) => ({
      ...a,
      matchedSkills: JSON.parse(a.matchedSkillsJson),
      missingSkills: JSON.parse(a.missingSkillsJson),
      partialGaps: JSON.parse(a.partialGapsJson),
      recommendedActions: JSON.parse(a.recommendedActionsJson),
      weightsUsed: JSON.parse(a.weightsUsedJson),
    }));

    res.json({ analyses: parsed });
  } catch (error) {
    next(error);
  }
});

// GET /api/analysis/:id
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const analysis = await prisma.jobAnalysisRecord.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Job analysis record not found.' });
    }

    const parsed = {
      ...analysis,
      matchedSkills: JSON.parse(analysis.matchedSkillsJson),
      missingSkills: JSON.parse(analysis.missingSkillsJson),
      partialGaps: JSON.parse(analysis.partialGapsJson),
      recommendedActions: JSON.parse(analysis.recommendedActionsJson),
      weightsUsed: JSON.parse(analysis.weightsUsedJson),
    };

    res.json({ analysis: parsed });
  } catch (error) {
    next(error);
  }
});

// POST /api/analysis/analyze
router.post('/analyze', validate(JobAnalysisInputSchema), async (req: AuthRequest, res, next) => {
  try {
    const { jobTitle, company, location, rawJobDescription, targetRoleId } = req.body;
    const profile = await getFullDomainProfile(req.user!.id);

    // Extract requirements deterministically
    const extracted = extractRequirementsFromText(rawJobDescription, jobTitle, targetRoleId || profile.targetRoleId);

    // Calculate score and explainable gap breakdown
    const result = calculateSkillGap(profile, extracted);

    // Persist analysis
    const saved = await prisma.jobAnalysisRecord.create({
      data: {
        userId: req.user!.id,
        jobTitle,
        company,
        location: location || 'Remote',
        rawJobDescription,
        targetRoleId: targetRoleId || profile.targetRoleId,
        overallScore: result.overallScore,
        potentialScore: result.potentialScore,
        technicalScore: result.technicalScore,
        experienceScore: result.experienceScore,
        educationScore: result.educationScore,
        softSkillsScore: result.softSkillsScore,
        projectScore: result.projectScore,
        keywordMatchScore: result.keywordMatchScore,
        verdict: result.verdict,
        summaryReason: result.summaryReason,
        matchedSkillsJson: JSON.stringify(result.matchedSkills),
        missingSkillsJson: JSON.stringify(result.missingSkills),
        partialGapsJson: JSON.stringify(result.partialGaps),
        recommendedActionsJson: JSON.stringify(result.recommendedActions),
        weightsUsedJson: JSON.stringify(result.weightsUsed),
      },
    });

    // Generate personalized roadmap
    const roadmapData = generatePersonalizedRoadmap(
      {
        ...result,
        id: saved.id,
        userId: req.user!.id,
        rawJobDescription,
        createdAt: saved.createdAt.toISOString(),
      },
      jobTitle
    );

    // Create or update roadmap
    await prisma.roadmapRecord.create({
      data: {
        userId: req.user!.id,
        analysisId: saved.id,
        title: `Targeted Roadmap: ${jobTitle} at ${company}`,
        targetRole: jobTitle,
        totalWeeks: roadmapData.totalWeeks,
        estimatedHours: roadmapData.estimatedHours,
        status: 'active',
        progressPercentage: 0,
        milestonesJson: JSON.stringify(roadmapData.milestones),
      },
    });

    res.status(201).json({
      message: 'Analysis generated successfully',
      analysis: {
        ...saved,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        partialGaps: result.partialGaps,
        recommendedActions: result.recommendedActions,
        weightsUsed: result.weightsUsed,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/analysis/compare
router.post('/compare', async (req: AuthRequest, res, next) => {
  try {
    const { analysisIds } = req.body;
    if (!analysisIds || !Array.isArray(analysisIds) || analysisIds.length < 2) {
      return res.status(400).json({ message: 'Please provide at least 2 analysis IDs to compare.' });
    }

    const records = await prisma.jobAnalysisRecord.findMany({
      where: {
        id: { in: analysisIds.slice(0, 3) },
        userId: req.user!.id,
      },
    });

    if (records.length < 2) {
      return res.status(404).json({ message: 'Could not find the specified analyses.' });
    }

    const parsedAnalyses = records.map((r) => ({
      ...r,
      matchedSkills: JSON.parse(r.matchedSkillsJson),
      missingSkills: JSON.parse(r.missingSkillsJson),
      partialGaps: JSON.parse(r.partialGapsJson),
      recommendedActions: JSON.parse(r.recommendedActionsJson),
      weightsUsed: JSON.parse(r.weightsUsedJson),
    }));

    // Find highest match
    const highest = [...parsedAnalyses].sort((a, b) => b.overallScore - a.overallScore)[0];

    // Find shared missing skills
    const skillCounts = new Map<string, number>();
    parsedAnalyses.forEach((a) => {
      a.missingSkills.forEach((s: any) => {
        skillCounts.set(s.name, (skillCounts.get(s.name) || 0) + 1);
      });
    });

    const sharedMissing = Array.from(skillCounts.entries())
      .filter(([_, count]) => count >= 2)
      .map(([name]) => name);

    const recommendation = `You are best positioned for ${highest.jobTitle} at ${highest.company} (${highest.overallScore}% match). Focusing on shared gaps (${sharedMissing.slice(0, 2).join(', ')}) will simultaneously advance your readiness for all evaluated roles.`;

    res.json({
      comparison: {
        jobAnalyses: parsedAnalyses,
        highestMatchId: highest.id,
        sharedMissingSkills: sharedMissing,
        recommendation,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
