import { Router } from 'express';
import { prisma } from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { MASTER_SKILLS } from '@skillgap/config';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import os from 'os';
import { parseResume } from '../services/resumeParser';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-development-key-skillgap-ai-2026-production-ready';

// Detect local network IP for phone scanning on same Wi-Fi
export function getLocalNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  // 1. Prioritize standard LAN subnets (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  for (const name of Object.keys(interfaces)) {
    const list = interfaces[name] || [];
    for (const net of list) {
      const isIpv4 = net.family === 'IPv4' || (net.family as any) === 4;
      if (isIpv4 && !net.internal && (net.address.startsWith('192.168.') || net.address.startsWith('10.') || net.address.startsWith('172.'))) {
        return net.address;
      }
    }
  }
  // 2. Any non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    const list = interfaces[name] || [];
    for (const net of list) {
      const isIpv4 = net.family === 'IPv4' || (net.family as any) === 4;
      if (isIpv4 && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const router = Router();

// Helper to extract skills and info from resume text
function parseResumeEntities(text: string) {
  const lowerText = text.toLowerCase();

  // Extract Email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const email = emailMatch ? emailMatch[1] : '';

  // Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract Links
  const githubMatch = text.match(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = text.match(/https?:\/\/(www\.)?(?!github|linkedin)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?/i);

  // Extract Skills
  const detectedSkills: Array<{ skillName: string; category: string; proficiency: string }> = [];
  MASTER_SKILLS.forEach((s) => {
    const regex = new RegExp(`\\b${s.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText) || lowerText.includes(s.slug)) {
      detectedSkills.push({
        skillName: s.name,
        category: s.category,
        proficiency: 'intermediate',
      });
    }
  });

  // Extract Degree
  let degree = '';
  if (lowerText.includes('bachelor') || lowerText.includes('b.tech') || lowerText.includes('b.e.') || lowerText.includes('b.s.')) {
    degree = 'Bachelor of Science / B.Tech';
  } else if (lowerText.includes('master') || lowerText.includes('m.s.') || lowerText.includes('m.tech')) {
    degree = 'Master of Science';
  }

  // Extract Year
  const yearMatch = text.match(/\b(20[12]\d)\b/g);
  const graduationYear = yearMatch ? parseInt(yearMatch[yearMatch.length - 1], 10) : 2026;

  return {
    email,
    phone,
    githubUrl: githubMatch ? githubMatch[0] : '',
    linkedinUrl: linkedinMatch ? linkedinMatch[0] : '',
    portfolioUrl: portfolioMatch ? portfolioMatch[0] : '',
    degree,
    graduationYear,
    skills: detectedSkills,
  };
}

// 1. GET /api/resume/qr-token (Requires Auth)
// Desktop app calls this to generate a QR sync token with LAN IP for phone scanning
router.get('/qr-token', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const token = crypto.randomBytes(16).toString('hex');
    const now = new Date();
    // 10 minute lifetime
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    const lanIp = getLocalNetworkIp();
    const port = process.env.WEB_PORT || 5173;

    // Build real URL that mobile phone can access
    const baseUrl = process.env.APP_URL || `http://${lanIp}:${port}`;
    const mobileUrl = `${baseUrl}/mobile-upload/${token}`;

    await prisma.qRUploadSession.create({
      data: {
        secureToken: token,
        status: 'PENDING',
        desktopUserId: req.user!.id,
        expiresAt,
      },
    });

    res.json({
      token,
      mobileUrl,
      lanIp,
      userName: req.user!.name,
      userEmail: req.user!.email,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds: 600,
    });
  } catch (err) {
    next(err);
  }
});

// 2. GET /api/resume/qr-status/:token (Public)
// Desktop polls this to check if mobile submitted the form or if session expired
router.get('/qr-status/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const session = await prisma.qRUploadSession.findUnique({
      where: { secureToken: token },
    });

    if (!session) {
      return res.status(404).json({
        status: 'EXPIRED',
        completed: false,
        message: 'This upload session has expired or is invalid.',
      });
    }

    const now = new Date();
    const isExpired = now > session.expiresAt;

    if (isExpired && session.status !== 'COMPLETED') {
      if (session.status !== 'EXPIRED') {
        await prisma.qRUploadSession.update({
          where: { id: session.id },
          data: { status: 'EXPIRED' },
        });
      }
      return res.json({
        status: 'EXPIRED',
        completed: false,
        message: 'This upload session has expired.',
      });
    }

    if (session.status === 'COMPLETED') {
      return res.json({
        status: 'COMPLETED',
        completed: true,
        data: {
          githubUrl: session.githubUrl,
          linkedinUrl: session.linkedinUrl,
          portfolioUrl: session.portfolioUrl,
          resumeFileName: session.resumeFileName,
          skillsSynced: session.skillsCount,
          completedAt: session.completedAt,
        },
      });
    }

    res.json({
      status: 'PENDING',
      completed: false,
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/resume/qr-session/:token (Public)
// Mobile opens this to inspect session validity and user profile info
router.get('/qr-session/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const session = await prisma.qRUploadSession.findUnique({
      where: { secureToken: token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        valid: false,
        expired: true,
        message: 'This upload session has expired or is invalid.',
      });
    }

    const now = new Date();
    const isExpired = now > session.expiresAt;

    if (isExpired && session.status !== 'COMPLETED') {
      return res.status(410).json({
        valid: false,
        expired: true,
        message: 'This upload session has expired.',
      });
    }

    res.json({
      valid: true,
      expired: false,
      status: session.status,
      completed: session.status === 'COMPLETED',
      userName: session.user.name,
      userEmail: session.user.email,
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// 3b. POST /api/resume/mobile-upload/:token (Public via secure token)
// Dedicated mobile upload endpoint called directly from mobile browser
router.post('/mobile-upload/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const {
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      resumeFileName,
      resumeText,
      targetRoleId,
      headline,
    } = req.body;

    const session = await prisma.qRUploadSession.findUnique({
      where: { secureToken: token },
      include: { user: true },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'This upload session does not exist or has expired.',
      });
    }

    const now = new Date();
    if (now > session.expiresAt && session.status !== 'COMPLETED') {
      return res.status(410).json({
        success: false,
        message: 'This upload session has expired. Please generate a new QR code on your computer.',
      });
    }

    const targetUserId = session.desktopUserId;

    // Parse resume text if provided
    let detectedGithub = githubUrl || '';
    let detectedLinkedin = linkedinUrl || '';
    let detectedPortfolio = portfolioUrl || '';
    const skillsToApply: Array<{ skillName: string; category: string; proficiency: string }> = [];

    if (resumeText && typeof resumeText === 'string') {
      const parsed = parseResumeEntities(resumeText);
      if (!detectedGithub && parsed.githubUrl) detectedGithub = parsed.githubUrl;
      if (!detectedLinkedin && parsed.linkedinUrl) detectedLinkedin = parsed.linkedinUrl;
      if (!detectedPortfolio && parsed.portfolioUrl) detectedPortfolio = parsed.portfolioUrl;
      skillsToApply.push(...parsed.skills);
    }

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: targetUserId,
          headline: headline || 'Software Engineer Candidate',
        },
      });
    }

    // Update profile with URLs and details
    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(detectedGithub ? { githubUrl: detectedGithub } : {}),
        ...(detectedLinkedin ? { linkedinUrl: detectedLinkedin } : {}),
        ...(detectedPortfolio ? { portfolioUrl: detectedPortfolio } : {}),
        ...(targetRoleId ? { targetRoleId } : {}),
      },
    });

    // Add detected skills to user profile
    let addedSkillsCount = 0;
    for (const skill of skillsToApply) {
      const existing = await prisma.userSkill.findFirst({
        where: {
          profileId: profile.id,
          skillName: { equals: skill.skillName },
        },
      });

      if (!existing) {
        await prisma.userSkill.create({
          data: {
            profileId: profile.id,
            skillName: skill.skillName,
            category: skill.category || 'Tools',
            proficiency: skill.proficiency || 'intermediate',
            yearsOfExp: 1.0,
            verified: true,
          },
        });
        addedSkillsCount++;
      }
    }

    // Mark session as COMPLETED in database
    await prisma.qRUploadSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        resumeFileName: resumeFileName || null,
        resumeText: resumeText || null,
        githubUrl: detectedGithub || null,
        linkedinUrl: detectedLinkedin || null,
        portfolioUrl: detectedPortfolio || null,
        skillsCount: skillsToApply.length,
      },
    });

    res.json({
      success: true,
      message: 'Profile information uploaded and synced successfully!',
      data: {
        userName: session.user.name,
        githubUrl: detectedGithub,
        linkedinUrl: detectedLinkedin,
        portfolioUrl: detectedPortfolio,
        skillsCount: skillsToApply.length,
        addedSkillsCount,
      },
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
});

// 4. POST /api/resume/parse (Public or Auth)
router.post('/parse', async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
    return res.status(400).json({ message: 'Please paste your resume content before parsing.' });
  }

  try {
    const parsed = parseResume(resumeText);
    res.json({
      success: true,
      parsed: {
        ...parsed,
        rawTextSnippet: resumeText.slice(0, 300) + '...',
      },
      message: `Successfully extracted ${parsed.skills.length} skills and profile credentials.`,
    });
  } catch (error) {
    console.error('Error parsing resume text:', error);
    res.status(500).json({
      message: 'Unable to parse the resume. Please check the content and try again.',
    });
  }
});

// 5. POST /api/resume/apply (Auth required)
router.post('/apply', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const {
      name,
      location,
      summary,
      skills,
      degree,
      graduationYear,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      phone,
      education,
      experience,
      projects,
      certifications,
    } = req.body;

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update profile contact & summary details
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(degree ? { degree } : {}),
        ...(graduationYear ? { graduationYear: typeof graduationYear === 'number' ? graduationYear : parseInt(graduationYear, 10) } : {}),
        ...(githubUrl ? { githubUrl } : {}),
        ...(linkedinUrl ? { linkedinUrl } : {}),
        ...(portfolioUrl ? { portfolioUrl } : {}),
        ...(phone ? { phone } : {}),
        ...(location ? { location } : {}),
        ...(summary ? { bio: summary } : {}),
      },
    });

    // Update User's name if name was extracted and current user doesn't have custom name
    if (name && typeof name === 'string' && name.trim()) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { name: name.trim() },
      });
    }

    // Add extracted skills safely (supports string[] or object[])
    if (skills && Array.isArray(skills)) {
      for (const s of skills) {
        const skillName = typeof s === 'string' ? s.trim() : (s?.skillName || s?.name || '').trim();
        if (!skillName) continue;

        const existing = await prisma.userSkill.findFirst({
          where: { profileId: profile.id, skillName: { equals: skillName } },
        });

        if (!existing) {
          await prisma.userSkill.create({
            data: {
              profileId: profile.id,
              skillName,
              category: (typeof s === 'object' && s?.category) || 'Tools',
              proficiency: (typeof s === 'object' && s?.proficiency) || 'intermediate',
              yearsOfExp: 1.0,
              verified: true,
            },
          });
        }
      }
    }

    // Add education entries if provided
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        const deg = edu.degree || 'Degree';
        const inst = edu.institution || 'University';
        const existing = await prisma.education.findFirst({
          where: { profileId: profile.id, institution: inst, degree: deg },
        });
        if (!existing) {
          await prisma.education.create({
            data: {
              profileId: profile.id,
              degree: deg,
              institution: inst,
              fieldOfStudy: edu.fieldOfStudy || 'Computer Science / Engineering',
              startYear: typeof edu.year === 'number' ? edu.year - 4 : 2022,
              endYear: typeof edu.year === 'number' ? edu.year : 2026,
              grade: edu.grade || null,
            },
          });
        }
      }
    }

    // Add projects if provided
    if (projects && Array.isArray(projects)) {
      for (const proj of projects) {
        const title = proj.title || '';
        if (!title) continue;
        const existing = await prisma.project.findFirst({
          where: { profileId: profile.id, title },
        });
        if (!existing) {
          await prisma.project.create({
            data: {
              profileId: profile.id,
              title,
              description: proj.description || 'Academic & applied engineering project.',
              skillsUsed: JSON.stringify(proj.techStack || []),
              highlights: JSON.stringify([]),
            },
          });
        }
      }
    }

    // Add certifications if provided
    if (certifications && Array.isArray(certifications)) {
      for (const cert of certifications) {
        const cName = cert.name || '';
        if (!cName) continue;
        const existing = await prisma.certification.findFirst({
          where: { profileId: profile.id, name: cName },
        });
        if (!existing) {
          await prisma.certification.create({
            data: {
              profileId: profile.id,
              name: cName,
              issuingOrg: cert.issuingOrg || 'Accredited Institution',
              issueDate: cert.date || '2025',
              skillsCovered: JSON.stringify([]),
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Resume data applied directly to your SkillGap profile.',
    });
  } catch (error) {
    next(error);
  }
});

// 6. POST /api/resume/quick-fill (Supports syncToken, Bearer auth, or email matching)
router.post('/quick-fill', async (req, res, next) => {
  try {
    const {
      syncToken,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      targetRoleId,
      headline,
      phone,
      degree,
      graduationYear,
      resumeText,
      skills,
      email,
    } = req.body;

    let targetUserId: string | null = null;
    let dbSession: any = null;

    // A. Match syncToken from database
    if (syncToken) {
      dbSession = await prisma.qRUploadSession.findUnique({
        where: { secureToken: syncToken },
      });
      if (dbSession) {
        targetUserId = dbSession.desktopUserId;
      }
    }

    // B. Match Bearer token if provided in header
    if (!targetUserId && req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        if (decoded?.userId) {
          targetUserId = decoded.userId;
        }
      } catch {
        // Bearer token check fallback
      }
    }

    // C. Match user by email
    if (!targetUserId && email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        targetUserId = user.id;
      }
    }

    // D. Fallback to first user in database (e.g., demo user)
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        targetUserId = firstUser.id;
      } else {
        return res.status(400).json({ message: 'No destination profile found for sync.' });
      }
    }

    // Find or create profile for target user
    let profile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: targetUserId,
          headline: headline || 'Software Engineer Candidate',
        },
      });
    }

    // Parse resume text if provided
    let extractedSkills: Array<{ skillName: string; category: string; proficiency: string }> = [];
    let detectedDegree = degree;
    let detectedGraduationYear = graduationYear;
    let detectedPhone = phone;
    let detectedGithub = githubUrl;
    let detectedLinkedin = linkedinUrl;
    let detectedPortfolio = portfolioUrl;

    if (resumeText && typeof resumeText === 'string' && resumeText.trim().length > 10) {
      const parsed = parseResumeEntities(resumeText);
      extractedSkills = parsed.skills;
      if (!detectedDegree && parsed.degree) detectedDegree = parsed.degree;
      if (!detectedGraduationYear && parsed.graduationYear) detectedGraduationYear = parsed.graduationYear;
      if (!detectedPhone && parsed.phone) detectedPhone = parsed.phone;
      if (!detectedGithub && parsed.githubUrl) detectedGithub = parsed.githubUrl;
      if (!detectedLinkedin && parsed.linkedinUrl) detectedLinkedin = parsed.linkedinUrl;
      if (!detectedPortfolio && parsed.portfolioUrl) detectedPortfolio = parsed.portfolioUrl;
    }

    // Combine explicit skills + extracted skills
    const combinedSkillsMap = new Map<string, { skillName: string; category: string; proficiency: string }>();
    extractedSkills.forEach((s) => combinedSkillsMap.set(s.skillName.toLowerCase(), s));
    if (Array.isArray(skills)) {
      skills.forEach((s: any) => {
        if (s && s.skillName) {
          combinedSkillsMap.set(s.skillName.toLowerCase(), {
            skillName: s.skillName,
            category: s.category || 'Technical',
            proficiency: s.proficiency || 'intermediate',
          });
        }
      });
    }

    // Update profile record
    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(detectedGithub ? { githubUrl: detectedGithub } : {}),
        ...(detectedLinkedin ? { linkedinUrl: detectedLinkedin } : {}),
        ...(detectedPortfolio ? { portfolioUrl: detectedPortfolio } : {}),
        ...(targetRoleId ? { targetRoleId } : {}),
        ...(headline ? { headline } : {}),
        ...(detectedPhone ? { phone: detectedPhone } : {}),
        ...(detectedDegree ? { degree: detectedDegree } : {}),
        ...(detectedGraduationYear ? { graduationYear: parseInt(String(detectedGraduationYear), 10) } : {}),
      },
    });

    // Save skills to UserSkill table
    let addedSkillsCount = 0;
    for (const skill of combinedSkillsMap.values()) {
      const existing = await prisma.userSkill.findFirst({
        where: {
          profileId: profile.id,
          skillName: { equals: skill.skillName },
        },
      });

      if (!existing) {
        await prisma.userSkill.create({
          data: {
            profileId: profile.id,
            skillName: skill.skillName,
            category: skill.category || 'Tools',
            proficiency: skill.proficiency || 'intermediate',
            yearsOfExp: 1.0,
            verified: true,
          },
        });
        addedSkillsCount++;
      }
    }

    // If QR sync session was active, flag as completed in DB
    if (dbSession) {
      await prisma.qRUploadSession.update({
        where: { id: dbSession.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          githubUrl: detectedGithub || null,
          linkedinUrl: detectedLinkedin || null,
          portfolioUrl: detectedPortfolio || null,
          skillsCount: combinedSkillsMap.size,
        },
      });
    }

    res.json({
      success: true,
      message: 'Candidate profile successfully synced with Resume, GitHub, and LinkedIn!',
      syncedData: {
        githubUrl: detectedGithub,
        linkedinUrl: detectedLinkedin,
        portfolioUrl: detectedPortfolio,
        targetRoleId,
        skillsCount: combinedSkillsMap.size,
        addedSkillsCount,
      },
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
