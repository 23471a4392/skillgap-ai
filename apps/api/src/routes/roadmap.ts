import { Router } from 'express';
import { prisma } from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// GET /api/roadmap
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const roadmap = await prisma.roadmapRecord.findFirst({
      where: { userId: req.user!.id, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    if (!roadmap) {
      return res.json({ roadmap: null });
    }

    res.json({
      roadmap: {
        ...roadmap,
        milestones: JSON.parse(roadmap.milestonesJson),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/roadmap/:id
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const roadmap = await prisma.roadmapRecord.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    res.json({
      roadmap: {
        ...roadmap,
        milestones: JSON.parse(roadmap.milestonesJson),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/roadmap/task/toggle
router.patch('/task/toggle', async (req: AuthRequest, res, next) => {
  try {
    const { roadmapId, milestoneId, taskId } = req.body;

    const roadmap = await prisma.roadmapRecord.findFirst({
      where: { id: roadmapId, userId: req.user!.id },
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    const milestones = JSON.parse(roadmap.milestonesJson);
    let totalTasks = 0;
    let completedTasks = 0;

    for (const m of milestones) {
      for (const t of m.actionableTasks) {
        totalTasks++;
        if (t.id === taskId) {
          t.completed = !t.completed;
        }
        if (t.completed) completedTasks++;
      }
      // Check if all tasks in milestone are done
      m.completed = m.actionableTasks.length > 0 && m.actionableTasks.every((t: any) => t.completed);
    }

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const updated = await prisma.roadmapRecord.update({
      where: { id: roadmap.id },
      data: {
        milestonesJson: JSON.stringify(milestones),
        progressPercentage,
      },
    });

    res.json({
      roadmap: {
        ...updated,
        milestones,
      },
      message: 'Task progress updated.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
