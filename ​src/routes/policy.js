const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lang = req.query.lang || 'am';
    const policy = await prisma.policy.findFirst({
      orderBy: { updated_at: 'desc' },
    });

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json({
      title: lang === 'en' ? policy.title_en : policy.title_am,
      content: lang === 'en' ? policy.content_en : policy.content_am,
      min_withdrawal_limit: policy.min_withdrawal_limit,
      updated_at: policy.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch policy', details: error.message });
  }
});

router.post('/admin', async (req, res) => {
  try {
    const { title_am, title_en, content_am, content_en, min_withdrawal_limit } = req.body;

    const policy = await prisma.policy.create({
      data: {
        title_am,
        title_en,
        content_am,
        content_en,
        min_withdrawal_limit: parseFloat(min_withdrawal_limit) || 100,
      },
    });

    await prisma.notification.create({
      data: {
        user_id: null,
        title: 'System Policy Updated',
        message: 'Our platform policies and minimum withdrawal limits have been updated.',
      },
    });

    res.status(201).json({
      message: 'Policy updated successfully and broadcast notification created.',
      policy,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update policy', details: error.message });
  }
});

module.exports = router;
