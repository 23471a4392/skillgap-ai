import { Router } from 'express';
import { prisma } from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  CertificationSchema,
  EducationSchema,
  ExperienceSchema,
  ProfileUpdateSchema,
  ProjectSchema,
  UserSkillSchema,
} from '@skillgap/validation';

const router = Router();
router.use(authMiddleware);

// Helper to get or create profile
async function getOrCreateProfile(userId: string) {
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
      data: {
        userId,
        headline: 'Aspiring Professional',
      },
      include: {
        skills: true,
        education: true,
        experience: true,
        projects: true,
        certifications: true,
      },
    });
  }

  return profile;
}

// GET /api/profile
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);

    const formatted = {
      ...profile,
      projects: profile.projects.map((p) => ({
        ...p,
        skillsUsed: JSON.parse(p.skillsUsed || '[]'),
        highlights: JSON.parse(p.highlights || '[]'),
      })),
      experience: profile.experience.map((e) => ({
        ...e,
        skillsUsed: JSON.parse(e.skillsUsed || '[]'),
      })),
      certifications: profile.certifications.map((c) => ({
        ...c,
        skillsCovered: JSON.parse(c.skillsCovered || '[]'),
      })),
    };

    res.json({ profile: formatted });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/profile
router.patch('/', validate(ProfileUpdateSchema), async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);
    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: req.body,
    });
    res.json({ profile: updated, message: 'Profile details updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// --- SKILLS ---
router.post('/skills', validate(UserSkillSchema), async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);
    const { skillName, category, proficiency, yearsOfExp, lastUsedYear, verified } = req.body;

    // Check if skill already exists in profile
    const existing = await prisma.userSkill.findFirst({
      where: {
        profileId: profile.id,
        skillName: { equals: skillName },
      },
    });

    if (existing) {
      const updated = await prisma.userSkill.update({
        where: { id: existing.id },
        data: { proficiency, yearsOfExp, lastUsedYear, verified },
      });
      return res.json({ skill: updated, message: 'Skill proficiency updated.' });
    }

    const newSkill = await prisma.userSkill.create({
      data: {
        profileId: profile.id,
        skillName,
        category,
        proficiency,
        yearsOfExp: yearsOfExp || 1.0,
        lastUsedYear,
        verified: verified || false,
      },
    });

    res.status(201).json({ skill: newSkill, message: 'Skill added to your inventory.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/skills/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { proficiency, yearsOfExp, verified } = req.body;

    const skill = await prisma.userSkill.update({
      where: { id },
      data: { proficiency, yearsOfExp, verified },
    });

    res.json({ skill, message: 'Skill updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/skills/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.userSkill.delete({ where: { id } });
    res.json({ message: 'Skill removed from profile.' });
  } catch (error) {
    next(error);
  }
});

// --- EDUCATION ---
router.post('/education', validate(EducationSchema), async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);
    const edu = await prisma.education.create({
      data: {
        profileId: profile.id,
        ...req.body,
      },
    });
    res.status(201).json({ education: edu, message: 'Education entry added.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/education/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const edu = await prisma.education.update({
      where: { id },
      data: req.body,
    });
    res.json({ education: edu, message: 'Education entry updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/education/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    res.json({ message: 'Education entry deleted.' });
  } catch (error) {
    next(error);
  }
});

// --- EXPERIENCE ---
router.post('/experience', validate(ExperienceSchema), async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);
    const { skillsUsed, ...rest } = req.body;

    const exp = await prisma.experience.create({
      data: {
        profileId: profile.id,
        ...rest,
        skillsUsed: JSON.stringify(skillsUsed || []),
      },
    });

    res.status(201).json({
      experience: { ...exp, skillsUsed: JSON.parse(exp.skillsUsed) },
      message: 'Experience entry saved.',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/experience/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { skillsUsed, ...rest } = req.body;

    const dataToUpdate: any = { ...rest };
    if (skillsUsed) {
      dataToUpdate.skillsUsed = JSON.stringify(skillsUsed);
    }

    const exp = await prisma.experience.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({
      experience: { ...exp, skillsUsed: JSON.parse(exp.skillsUsed) },
      message: 'Experience updated.',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/experience/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.json({ message: 'Experience entry deleted.' });
  } catch (error) {
    next(error);
  }
});

// --- PROJECTS ---
router.post('/projects', validate(ProjectSchema), async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);
    const { skillsUsed, highlights, ...rest } = req.body;

    const proj = await prisma.project.create({
      data: {
        profileId: profile.id,
        ...rest,
        skillsUsed: JSON.stringify(skillsUsed || []),
        highlights: JSON.stringify(highlights || []),
      },
    });

    res.status(201).json({
      project: {
        ...proj,
        skillsUsed: JSON.parse(proj.skillsUsed),
        highlights: JSON.parse(proj.highlights),
      },
      message: 'Project added to portfolio.',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/projects/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { skillsUsed, highlights, ...rest } = req.body;

    const dataToUpdate: any = { ...rest };
    if (skillsUsed) dataToUpdate.skillsUsed = JSON.stringify(skillsUsed);
    if (highlights) dataToUpdate.highlights = JSON.stringify(highlights);

    const proj = await prisma.project.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({
      project: {
        ...proj,
        skillsUsed: JSON.parse(proj.skillsUsed),
        highlights: JSON.parse(proj.highlights),
      },
      message: 'Project updated.',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/projects/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project removed from portfolio.' });
  } catch (error) {
    next(error);
  }
});

// --- CERTIFICATIONS ---
router.post('/certifications', validate(CertificationSchema), async (req: AuthRequest, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user!.id);
    const { skillsCovered, ...rest } = req.body;

    const cert = await prisma.certification.create({
      data: {
        profileId: profile.id,
        ...rest,
        skillsCovered: JSON.stringify(skillsCovered || []),
      },
    });

    res.status(201).json({
      certification: { ...cert, skillsCovered: JSON.parse(cert.skillsCovered) },
      message: 'Certification added.',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/certifications/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.certification.delete({ where: { id } });
    res.json({ message: 'Certification removed.' });
  } catch (error) {
    next(error);
  }
});

export default router;
