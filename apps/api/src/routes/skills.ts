import { Router } from 'express';
import { MASTER_SKILLS, SKILL_CATEGORIES } from '@skillgap/config';

const router = Router();

// GET /api/skills
router.get('/', (req, res) => {
  const { category, search } = req.query;

  let skills = [...MASTER_SKILLS];

  if (category && typeof category === 'string') {
    skills = skills.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    skills = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  res.json({ skills });
});

// GET /api/skills/categories
router.get('/categories', (req, res) => {
  res.json({ categories: SKILL_CATEGORIES });
});

// GET /api/skills/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const skill = MASTER_SKILLS.find((s) => s.id === id || s.slug === id);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found in registry.' });
  }

  res.json({ skill });
});

export default router;
