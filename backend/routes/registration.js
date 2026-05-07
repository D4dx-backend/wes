const express = require('express');
const rateLimit = require('express-rate-limit');
const Registration = require('../models/Registration');
const {
  INDUSTRY_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  BUSINESS_SCALE_OPTIONS,
} = require('../models/Registration');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this IP. Please try again later.' },
});

router.get('/options', (_req, res) => {
  res.json({
    industry: INDUSTRY_OPTIONS,
    businessStage: BUSINESS_STAGE_OPTIONS,
    businessScale: BUSINESS_SCALE_OPTIONS,
  });
});

router.post('/', submitLimiter, async (req, res) => {
  try {
    const {
      fullName,
      age,
      whatsappNumber,
      email,
      district,
      gpay,
      ventureName,
      industry,
      businessStage,
      businessScale,
    } = req.body || {};

    const ageNum = Number(age);

    const doc = await Registration.create({
      fullName: typeof fullName === 'string' ? fullName.trim() : fullName,
      age: ageNum,
      whatsappNumber: typeof whatsappNumber === 'string' ? whatsappNumber.trim() : whatsappNumber,
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
      district: typeof district === 'string' ? district.trim() : district,
      gpay: typeof gpay === 'string' ? gpay.trim() : gpay,
      ventureName:
        typeof ventureName === 'string' && ventureName.trim().length > 0
          ? ventureName.trim()
          : 'N/A',
      industry,
      businessStage,
      businessScale,
    });

    return res.status(201).json({
      ok: true,
      id: doc._id,
      message: 'Registration submitted successfully',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const fields = {};
      for (const key of Object.keys(err.errors)) {
        fields[key] = err.errors[key].message;
      }
      return res.status(400).json({ error: 'Validation failed', fields });
    }
    console.error('[registration] error:', err);
    return res.status(500).json({ error: 'Failed to submit registration' });
  }
});

module.exports = router;
