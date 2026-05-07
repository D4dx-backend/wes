const express = require('express');
const Registration = require('../models/Registration');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAdmin);

const SORTABLE_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'fullName',
  'age',
  'email',
  'district',
  'industry',
  'businessStage',
  'businessScale',
  'ventureName',
]);

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/registrations', async (req, res) => {
  try {
    const {
      search = '',
      industry,
      businessStage,
      businessScale,
      district,
      sortBy = 'createdAt',
      sortDir = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (search && String(search).trim().length > 0) {
      const re = new RegExp(escapeRegex(String(search).trim()), 'i');
      query.$or = [
        { fullName: re },
        { email: re },
        { whatsappNumber: re },
        { ventureName: re },
        { district: re },
        { gpay: re },
      ];
    }

    if (industry) query.industry = industry;
    if (businessStage) query.businessStage = businessStage;
    if (businessScale) query.businessScale = businessScale;
    if (district) query.district = new RegExp('^' + escapeRegex(String(district)) + '$', 'i');

    const sortField = SORTABLE_FIELDS.has(String(sortBy)) ? String(sortBy) : 'createdAt';
    const sortDirection = String(sortDir).toLowerCase() === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Registration.find(query)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Registration.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    console.error('[admin] list error:', err);
    res.status(500).json({ error: 'Failed to load registrations' });
  }
});

router.get('/registrations/stats', async (_req, res) => {
  try {
    const [total, byIndustry, byStage, byScale] = await Promise.all([
      Registration.countDocuments({}),
      Registration.aggregate([
        { $group: { _id: '$industry', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Registration.aggregate([
        { $group: { _id: '$businessStage', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Registration.aggregate([
        { $group: { _id: '$businessScale', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    res.json({ total, byIndustry, byStage, byScale });
  } catch (err) {
    console.error('[admin] stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

router.get('/registrations/export', async (req, res) => {
  try {
    const items = await Registration.find({}).sort({ createdAt: -1 }).lean();

    const fields = [
      ['createdAt', 'Submitted At'],
      ['fullName', 'Full Name'],
      ['age', 'Age'],
      ['whatsappNumber', 'WhatsApp'],
      ['email', 'Email'],
      ['district', 'District'],
      ['gpay', 'GPay'],
      ['ventureName', 'Venture/Business'],
      ['industry', 'Industry'],
      ['businessStage', 'Business Stage'],
      ['businessScale', 'Business Scale'],
    ];

    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const s = String(val).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };

    const header = fields.map(([, label]) => label).join(',');
    const rows = items
      .map((it) =>
        fields
          .map(([key]) => {
            const v = it[key];
            if (key === 'createdAt' && v) return new Date(v).toISOString();
            return escape(v);
          })
          .join(',')
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
    res.send(header + '\n' + rows);
  } catch (err) {
    console.error('[admin] export error:', err);
    res.status(500).json({ error: 'Failed to export' });
  }
});

router.get('/registrations/:id', async (req, res) => {
  try {
    const doc = await Registration.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

router.delete('/registrations/:id', async (req, res) => {
  try {
    const doc = await Registration.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;
